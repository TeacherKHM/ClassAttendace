"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getStudents, getAttendance } from "@/lib/storage";
import CalendarView from "./CalendarView";

export default function SummaryPage() {
  const [data, setData] = useState({ students: [], records: {}, dates: [] });
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState("matrix"); // "matrix" | "calendar"

  useEffect(() => {
    setIsClient(true);
    const students = getStudents();
    const records = getAttendance();
    const dates = Object.keys(records).sort().reverse(); // Newest first
    setData({ students, records, dates });
  }, []);

  const getStats = (studentId) => {
    let stats = { Present: 0, Late: 0, Absent: 0, Justified: 0 };
    data.dates.forEach(date => {
      const status = data.records[date]?.[studentId];
      if (status) stats[status]++;
    });
    return stats;
  };

  const handleExport = () => {
    const headers = ["Name", "ID", "Present", "Late", "Absent", "Justified", ...data.dates];
    const rows = data.students.map(student => {
      const stats = getStats(student.id);
      const attendance = data.dates.map(date => data.records[date]?.[student.id] || "-");
      return [
        student.name,
        student.id,
        stats.Present,
        stats.Late,
        stats.Absent,
        stats.Justified,
        ...attendance
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Summary</h1>
        
        <div className={styles.controls}>
          <div className={styles.toggleGroup}>
            <button 
              className={`${styles.toggleButton} ${viewMode === "matrix" ? styles.active : ""}`}
              onClick={() => setViewMode("matrix")}
            >
              Matrix
            </button>
            <button 
              className={`${styles.toggleButton} ${viewMode === "calendar" ? styles.active : ""}`}
              onClick={() => setViewMode("calendar")}
            >
              Calendar
            </button>
          </div>
          <button className={styles.exportButton} onClick={handleExport}>
            Export to Sheets
          </button>
        </div>
      </div>

      {viewMode === "matrix" ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Late</th>
                <th>Absent</th>
                {data.dates.map(date => (
                  <th key={date}>{date.slice(5)}</th> // Show MM-DD
                ))}
              </tr>
            </thead>
            <tbody>
              {data.students.map(student => {
                const stats = getStats(student.id);
                return (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{stats.Late}</td>
                    <td>{stats.Absent}</td>
                    {data.dates.map(date => {
                      const status = data.records[date]?.[student.id];
                      return (
                        <td key={date}>
                          {status ? (
                            <div className={`${styles.cell} ${styles[status.toLowerCase()]}`}>
                              {status[0]} 
                            </div>
                          ) : "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <CalendarView data={data.records} students={data.students} />
      )}
    </div>
  );
}
