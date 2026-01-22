"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getStudents, getStudentPreceptoria, addStudentPreceptoria } from "@/lib/storage";

export default function PreceptoriaPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewLog, setViewLog] = useState(null); // Log object to view

  // Form State
  const [sessionDate, setSessionDate] = useState("");
  const [sessionType, setSessionType] = useState("Student");
  const [sessionNotes, setSessionNotes] = useState("");

  useEffect(() => {
    setIsClient(true);
    setStudents(getStudents());
    const today = new Date().toISOString().split("T")[0];
    setSessionDate(today);
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setLogs(getStudentPreceptoria(student.id));
    setShowAddModal(false);
    setViewLog(null);
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    if (!sessionNotes.trim()) return;

    const newSession = {
      id: Date.now().toString(),
      date: sessionDate,
      type: sessionType,
      notes: sessionNotes
    };

    addStudentPreceptoria(selectedStudent.id, newSession);
    setLogs([newSession, ...logs]);
    
    // Reset and Close
    setSessionNotes("");
    setShowAddModal(false);
  };

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      {/* Left Panel: Student List */}
      <div className={styles.listPanel}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search students..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.studentList}>
          {filteredStudents.map(student => (
            <div 
              key={student.id} 
              className={`${styles.studentItem} ${selectedStudent?.id === student.id ? styles.active : ''}`}
              onClick={() => handleSelectStudent(student)}
            >
              <span className={styles.studentName}>{student.name}</span>
              <span className={styles.studentDetail}>{student.classroom}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Details */}
      <div className={styles.detailPanel}>
        {selectedStudent ? (
          <>
            <div className={styles.profileCard}>
              <h2 className={styles.profileName}>{selectedStudent.name}</h2>
              <div className={styles.profileGrid}>
                <div className={styles.profileItem}>
                  <span className={styles.label}>Classroom</span>
                  <span className={styles.value}>{selectedStudent.classroom || "-"}</span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.label}>Workshop</span>
                  <span className={styles.value}>{selectedStudent.workshop || "-"}</span>
                </div>
                <div className={styles.profileItem}>
                  <span className={styles.label}>Specialization</span>
                  <span className={styles.value}>{selectedStudent.specialization || "-"}</span>
                </div>
              </div>
            </div>

            <div className={styles.sectionTitle}>
              <span>Preceptoría Logs</span>
              <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
                + New Session
              </button>
            </div>

            <div className={styles.logList}>
              {logs.length === 0 ? (
                <p>No sessions recorded yet.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className={styles.logEntry} onClick={() => setViewLog(log)}>
                    <div className={styles.logHeader}>
                      <span className={styles.logType}>{log.type} Session</span>
                      <span className={styles.logDate}>{log.date}</span>
                    </div>
                    <p className={styles.logPreview}>{log.notes}</p>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            Select a student to view details
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.largeModal}`}>
            <h2 className={styles.sectionTitle}>Add Session</h2>
            <form onSubmit={handleAddSession}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Date</label>
                <input 
                  type="date" 
                  required
                  className={styles.formInput}
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Type</label>
                <select 
                  className={styles.select}
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                >
                  <option value="Student">Student Preceptoría</option>
                  <option value="Family">Family Preceptoría</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Notes</label>
                <textarea 
                  required
                  className={`${styles.formInput} ${styles.largeTextarea}`}
                  placeholder="Details about the session..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Log Modal */}
      {viewLog && (
        <div className={styles.modalOverlay} onClick={() => setViewLog(null)}>
          <div className={`${styles.modal} ${styles.largeModal}`} onClick={e => e.stopPropagation()}>
             <div className={styles.logHeader}>
                <h2 className={styles.sectionTitle}>{viewLog.type} Session</h2>
                <span className={styles.logDate}>{viewLog.date}</span>
             </div>
             <div className={styles.logContent}>
               {viewLog.notes.split('\n').map((para, i) => (
                 <p key={i}>{para}</p>
               ))}
             </div>
             <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.submitBtn}
                  onClick={() => setViewLog(null)}
                >
                  Close
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
