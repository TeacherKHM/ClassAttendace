"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getStudents, getAttendanceForDate, saveAttendanceForDate } from "@/lib/storage";

export default function RecordPage() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadInitialData = async () => {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      const studentData = await getStudents();
      setStudents(studentData);
      const savedData = await getAttendanceForDate(today);
      setAttendance(savedData || {});
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!date) return;
    const loadAttendance = async () => {
      const savedData = await getAttendanceForDate(date);
      setAttendance(savedData || {});
      setSaved(false);
    };
    loadAttendance();
  }, [date]);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    await saveAttendanceForDate(date, attendance);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Record Attendance</h1>
        <div className={styles.controls}>
          <input
            type="date"
            className={styles.dateInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className={styles.saveButton} onClick={handleSave}>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {students.length === 0 ? (
          <p>No students found. Add some in the Manage tab.</p>
        ) : (
          students.map((student) => (
            <div key={student.id} className={styles.studentRow}>
              <span className={styles.studentName}>{student.name}</span>
              <div className={styles.statusGroup}>
                {["Present", "Late", "Absent", "Justified"].map((status) => {
                  const isSelected = attendance[student.id] === status;
                  const value = status;
                  return (
                    <button
                      key={status}
                      className={`${styles.statusButton} ${styles[status.toLowerCase()]} ${
                        isSelected ? styles.selected : ""
                      }`}
                      onClick={() => handleStatusChange(student.id, value)}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
