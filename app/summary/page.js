"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useData } from "@/app/context/DataContext";
import DailyTables from "./DailyTables";

export default function SummaryPage() {
  const { students, attendance: records, preceptoria, loading: contextLoading } = useData();
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState("matrix"); // "matrix" | "daily"
  
  // Date Range State
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    setIsClient(true);
    // Default: This Month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = today.toISOString().split('T')[0];
    setDateRange({ start: firstDay, end: lastDay });
  }, []);

  const dates = Object.keys(records).sort().reverse();
  const data = { students, records, dates, preceptoria };

  const getFilteredDates = () => {
    return data.dates.filter(date => date >= dateRange.start && date <= dateRange.end);
  };

  const getStats = (studentId, filteredDates) => {
    let stats = { Present: 0, Late: 0, Absent: 0, Justified: 0 };
    filteredDates.forEach(date => {
      const status = data.records[date]?.[studentId];
      if (status) stats[status]++;
    });
    return stats;
  };

  const getPreceptoriaStats = (studentId) => {
    const logs = data.preceptoria[studentId] || [];
    let stats = { studentSessions: 0, familySessions: 0, lastStudentSession: null };
    
    // Alert Logic: Check specific session types
    const studentLogs = logs.filter(l => l.type === "Student");
    if (studentLogs.length > 0) {
      // Assuming logs are chronological or we sort them. 
      // Storage implementation prepends new logs, so index 0 is newest.
      stats.lastStudentSession = studentLogs[0].date;
    }

    // Count within range
    logs.forEach(log => {
      if (log.date >= dateRange.start && log.date <= dateRange.end) {
        if (log.type === "Student") stats.studentSessions++;
        if (log.type === "Family") stats.familySessions++;
      }
    });

    return stats;
  };

  const isOverdue = (lastDate) => {
    if (!lastDate) return true; // No session ever? Overdue/Alert.
    const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
    const last = new Date(lastDate).getTime();
    const now = new Date().getTime();
    return (now - last) > twoWeeksMs;
  };

  const handleExport = () => {
    const filteredDates = getFilteredDates();
    const headers = [
      "Name", "ID", "Classroom", "Workshop", "Spec", 
      "Student Sess", "Family Sess", "Last Sess Date",
      "Present", "Late", "Absent", "Justified", 
      ...filteredDates
    ];
    
    const rows = data.students.map(student => {
      const attStats = getStats(student.id, filteredDates);
      const preStats = getPreceptoriaStats(student.id);
      const attendance = filteredDates.map(date => data.records[date]?.[student.id] || "-");
      
      return [
        student.name,
        student.id,
        student.classroom || "-",
        student.workshop || "-",
        student.specialization || "-",
        preStats.studentSessions,
        preStats.familySessions,
        preStats.lastStudentSession || "Never",
        attStats.Present,
        attStats.Late,
        attStats.Absent,
        attStats.Justified,
        ...attendance
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_full_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleCopyForSheets = () => {
    const filteredDates = getFilteredDates();
    const headers = [
      "Name", "ID", "Classroom", "Workshop", "Spec", 
      "Student Sess", "Family Sess", "Last Sess Date",
      "Present", "Late", "Absent", "Justified", 
      ...filteredDates
    ];
    
    const rows = data.students.map(student => {
      const attStats = getStats(student.id, filteredDates);
      const preStats = getPreceptoriaStats(student.id);
      const attendance = filteredDates.map(date => data.records[date]?.[student.id] || "-");
      
      return [
        student.name,
        student.id,
        student.classroom || "-",
        student.workshop || "-",
        student.specialization || "-",
        preStats.studentSessions,
        preStats.familySessions,
        preStats.lastStudentSession || "Never",
        attStats.Present,
        attStats.Late,
        attStats.Absent,
        attStats.Justified,
        ...attendance
      ];
    });

    const tsvContent = [headers, ...rows].map(row => row.join("\t")).join("\n");
    navigator.clipboard.writeText(tsvContent).then(() => {
      alert("Formatted data copied! You can now paste it directly into Google Sheets.");
    }).catch(err => {
      console.error("Failed to copy data: ", err);
      alert("Failed to copy data. Please check console for errors.");
    });
  };

  if (!isClient || contextLoading) return (
    <div className={styles.container}>
      <h1 className={styles.title}>Loading summary...</h1>
    </div>
  );
  const filteredDates = getFilteredDates();

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
              Matrix Report
            </button>
            <button 
              className={`${styles.toggleButton} ${viewMode === "daily" ? styles.active : ""}`}
              onClick={() => setViewMode("daily")}
            >
              Daily List
            </button>
          </div>
          <button className={styles.exportButton} onClick={handleExport}>
            Export CSV
          </button>
          <button className={`${styles.exportButton} ${styles.copyButton}`} onClick={handleCopyForSheets}>
            Copy for Sheets
          </button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <label>From: <input type="date" value={dateRange.start} max={new Date().toISOString().split("T")[0]} onChange={e => setDateRange({...dateRange, start: e.target.value})} /></label>
        <label>To: <input type="date" value={dateRange.end} max={new Date().toISOString().split("T")[0]} onChange={e => setDateRange({...dateRange, end: e.target.value})} /></label>
      </div>

      {viewMode === "matrix" ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>Student</th>
                <th>Class</th>
                <th>Work</th>
                <th>Spec</th>
                <th>Std Sess</th>
                <th>Fam Sess</th>
                <th>Late</th>
                <th>Abs</th>
                {filteredDates.map(date => (
                  <th key={date}>{date.slice(5)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.students.map(student => {
                const attStats = getStats(student.id, filteredDates);
                const preStats = getPreceptoriaStats(student.id);
                const overdue = isOverdue(preStats.lastStudentSession);

                return (
                  <tr key={student.id}>
                    <td className={styles.stickyCol}>
                      <div className={styles.studentName}>{student.name}</div>
                    </td>
                    <td className={styles.metaCell}>{student.classroom || "-"}</td>
                    <td className={styles.metaCell}>{student.workshop || "-"}</td>
                    <td className={styles.metaCell}>{student.specialization || "-"}</td>
                    <td>
                      <div className={`${styles.countBadge} ${overdue ? styles.overdue : ''}`} title={overdue ? `Last session: ${preStats.lastStudentSession || 'Never'}` : `Last: ${preStats.lastStudentSession}`}>
                        {preStats.studentSessions}
                      </div>
                    </td>
                    <td>
                      <div className={`${styles.countBadge} ${styles.blueBadge}`}>
                        {preStats.familySessions}
                      </div>
                    </td>
                    <td>{attStats.Late}</td>
                    <td>{attStats.Absent}</td>
                    {filteredDates.map(date => {
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
        <DailyTables dates={filteredDates} records={data.records} students={data.students} />
      )}
    </div>
  );
}
