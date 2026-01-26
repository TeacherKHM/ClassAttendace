"use client";

import { useState } from "react";
import { useData } from "../context/DataContext";
import { saveSocialAction } from "@/lib/storage";
import styles from "./page.module.css";

export default function SocialActionPage() {
  const { students, socialAction, refreshData, loading } = useData();
  const [saving, setSaving] = useState(null);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  const handleSave = async (studentId, record) => {
    setSaving(studentId);
    try {
      await saveSocialAction(studentId, record);
      await refreshData();
    } catch (error) {
      console.error("Error saving social action:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleFieldChange = (studentId, field, value) => {
    const currentRecord = socialAction[studentId] || {
      place: "",
      acceptance_letter: false,
      unit1_hours: 0,
      unit2_hours: 0,
      unit3_hours: 0
    };
    
    const updatedRecord = { ...currentRecord, [field]: value };
    handleSave(studentId, updatedRecord);
  };

  const handleCopyForSheets = () => {
    const headers = ["Student Name", "Place of Service", "Acceptance Letter", "Unit 1", "Unit 2", "Unit 3", "Total"];
    const rows = students.map(student => {
      const record = socialAction[student.id] || {};
      const totalHours = (Number(record.unit1_hours) || 0) + 
                         (Number(record.unit2_hours) || 0) + 
                         (Number(record.unit3_hours) || 0);
      return [
        student.name,
        record.place || "-",
        record.acceptance_letter ? "Yes" : "No",
        record.unit1_hours || 0,
        record.unit2_hours || 0,
        record.unit3_hours || 0,
        totalHours.toFixed(1)
      ];
    });

    const tsvContent = [headers, ...rows].map(row => row.join("\t")).join("\n");
    navigator.clipboard.writeText(tsvContent).then(() => {
      alert("Social Action data copied for Google Sheets!");
    }).catch(err => {
      console.error("Failed to copy data: ", err);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Social Action</h1>
          <p className={styles.subtitle}>Manage community service details for each student.</p>
        </div>
        <button className={styles.copyButton} onClick={handleCopyForSheets}>
          Copy for Google Sheets
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Place of Service</th>
              <th className={styles.center}>Acceptance</th>
              <th className={styles.center}>Unit 1</th>
              <th className={styles.center}>Unit 2</th>
              <th className={styles.center}>Unit 3</th>
              <th className={styles.center}>Total</th>
              <th className={styles.statusCell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const record = socialAction[student.id] || {};
              const totalHours = (Number(record.unit1_hours) || 0) + 
                                 (Number(record.unit2_hours) || 0) + 
                                 (Number(record.unit3_hours) || 0);

              return (
                <tr key={student.id}>
                  <td className={styles.studentName}>{student.name}</td>
                  <td>
                    <input
                      type="text"
                      className={styles.input}
                      defaultValue={record.place || ""}
                      onBlur={(e) => handleFieldChange(student.id, "place", e.target.value)}
                      placeholder="Location..."
                    />
                  </td>
                  <td className={styles.center}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={record.acceptance_letter || false}
                      onChange={(e) => handleFieldChange(student.id, "acceptance_letter", e.target.checked)}
                    />
                  </td>
                  <td className={styles.center}>
                    <input
                      type="number"
                      className={styles.numberInput}
                      defaultValue={record.unit1_hours || 0}
                      onBlur={(e) => handleFieldChange(student.id, "unit1_hours", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className={styles.center}>
                    <input
                      type="number"
                      className={styles.numberInput}
                      defaultValue={record.unit2_hours || 0}
                      onBlur={(e) => handleFieldChange(student.id, "unit2_hours", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className={styles.center}>
                    <input
                      type="number"
                      className={styles.numberInput}
                      defaultValue={record.unit3_hours || 0}
                      onBlur={(e) => handleFieldChange(student.id, "unit3_hours", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className={styles.totalHours}>{totalHours.toFixed(1)}</td>
                  <td className={styles.statusCell}>
                    {saving === student.id ? (
                      <span className={styles.saving}>Saving...</span>
                    ) : (
                      <span className={styles.saved}>Saved</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
