"use client";

import { useState } from "react";
import styles from "./CalendarView.module.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView({ data, students }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // { dateStr: "YYYY-MM-DD", records: [] }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDayContent = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayRecords = data[dateStr] || {};
    
    let absentCount = 0;
    let lateCount = 0;
    const details = [];

    Object.entries(dayRecords).forEach(([studentId, status]) => {
      if (status === "Absent") {
        absentCount++;
        const student = students.find(s => s.id === studentId);
        if (student) details.push({ name: student.name, status: "Absent" });
      } else if (status === "Late") {
        lateCount++;
        const student = students.find(s => s.id === studentId);
        if (student) details.push({ name: student.name, status: "Late" });
      }
    });

    return { absentCount, lateCount, details, dateStr };
  };

  const handleDayClick = (content) => {
    if (content.details.length > 0) {
      setSelectedDay({
        dateStr: content.dateStr,
        details: content.details
      });
    }
  };

  const renderCells = () => {
    const cells = [];
    
    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className={`${styles.dayCell} ${styles.empty}`} />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const content = getDayContent(d);
      const hasEvents = content.absentCount > 0 || content.lateCount > 0;
      
      cells.push(
        <div 
          key={d} 
          className={styles.dayCell}
          onClick={() => handleDayClick(content)}
        >
          <span className={styles.dayNumber}>{d}</span>
          {hasEvents && (
            <div className={styles.indicators}>
              {content.lateCount > 0 && (
                <span className={`${styles.indicator} ${styles.late}`}>
                  {content.lateCount} Late
                </span>
              )}
              {content.absentCount > 0 && (
                <span className={`${styles.indicator} ${styles.absent}`}>
                  {content.absentCount} Absent
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.controls}>
        <button onClick={prevMonth} className={styles.navButton}>&larr;</button>
        <h2 className={styles.monthTitle}>
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={nextMonth} className={styles.navButton}>&rarr;</button>
      </div>

      <div className={styles.grid}>
        {DAYS.map(d => <div key={d} className={styles.dayName}>{d}</div>)}
        {renderCells()}
      </div>

      {selectedDay && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDay(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedDay.dateStr}</h3>
              <button className={styles.closeButton} onClick={() => setSelectedDay(null)}>&times;</button>
            </div>
            <div className={styles.detailList}>
              {selectedDay.details.map((item, idx) => (
                <div key={idx} className={styles.detailItem}>
                  <span>{item.name}</span>
                  <span className={`${styles.detailStatus} ${styles[item.status.toLowerCase()]}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
