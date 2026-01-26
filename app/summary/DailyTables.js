"use client";

import styles from "./DailyTables.module.css";

export default function DailyTables({ dates, records, students }) {
  // Filter students who have at least one record in the given dates
  const studentsWithRecords = students.filter(student => 
    dates.some(date => records[date]?.[student.id])
  );

  if (studentsWithRecords.length === 0) {
    return <div className={styles.noData}>No attendance records found for the selected range.</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.dayTable}>
        <thead>
          <tr>
            <th className={styles.stickyCol}>Student Name</th>
            {dates.map(date => (
              <th key={date} className={styles.dateHeader}>
                {new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentsWithRecords.map((student) => (
            <tr key={student.id}>
              <td className={styles.stickyCol}>
                <div className={styles.studentName}>{student.name}</div>
                <div className={styles.classroom}>{student.classroom || "-"}</div>
              </td>
              {dates.map(date => {
                const status = records[date]?.[student.id];
                return (
                  <td key={date} className={styles.statusCell}>
                    {status ? (
                      <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>
                        {status[0]}
                      </span>
                    ) : (
                      <span className={styles.empty}>-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
