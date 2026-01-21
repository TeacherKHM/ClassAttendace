"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getStudents, saveStudents } from "@/lib/storage";

export default function ManagePage() {
  const [students, setStudents] = useState([]);
  const [newName, setNewName] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setStudents(getStudents());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newStudent = {
      id: Date.now().toString(),
      name: newName.trim(),
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    saveStudents(updated);
    setNewName("");
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure? This will remove the student from future lists.")) return;
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveStudents(updated);
  };

  const handleEdit = (id) => {
    const student = students.find((s) => s.id === id);
    const name = prompt("Enter new name:", student.name);
    if (name && name.trim()) {
      const updated = students.map((s) =>
        s.id === id ? { ...s, name: name.trim() } : s
      );
      setStudents(updated);
      saveStudents(updated);
    }
  };

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Students</h1>

      <form className={styles.form} onSubmit={handleAdd}>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter student name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className={styles.addButton}>
          Add Student
        </button>
      </form>

      <div className={styles.list}>
        {students.map((student) => (
          <div key={student.id} className={styles.item}>
            <span className={styles.name}>{student.name}</span>
            <div className={styles.actions}>
              <button
                className={styles.editButton}
                onClick={() => handleEdit(student.id)}
                title="Edit"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(student.id)}
                title="Delete"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
