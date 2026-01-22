"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getStudents, saveStudents } from "@/lib/storage";

export default function ManagePage() {
  const [students, setStudents] = useState([]);
  
  // Add Form State
  const [newName, setNewName] = useState("");
  const [classroom, setClassroom] = useState("");
  const [workshop, setWorkshop] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editClassroom, setEditClassroom] = useState("");
  const [editWorkshop, setEditWorkshop] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");

  const [bulkList, setBulkList] = useState("");
  const [mode, setMode] = useState("single"); // "single" | "bulk"
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadStudents = async () => {
      const data = await getStudents();
      setStudents(data);
    };
    loadStudents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newStudent = {
      name: newName.trim(),
      classroom,
      workshop,
      specialization
    };
    await saveStudents([newStudent]);
    // Refresh students list after adding to get the new UUID from Supabase
    const data = await getStudents();
    setStudents(data);
    
    // Reset Form
    setNewName("");
    setClassroom("");
    setWorkshop("");
    setSpecialization("");
  };

  const handleBulkAdd = async () => {
    if (!bulkList.trim()) return;
    const names = bulkList.split(/[\n,]/).map(n => n.trim()).filter(n => n.length > 0);
    if (names.length === 0) return;

    const newStudentsData = names.map((name) => ({
      name: name,
      classroom: "",
      workshop: "",
      specialization: ""
    }));

    await saveStudents(newStudentsData);
    const data = await getStudents();
    setStudents(data);
    setBulkList("");
    setMode("single");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will remove the student from future lists.")) return;
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    // Add deleteStudent to storage.js if not there, or use saveStudents with updated list 
    // but better to have a dedicated delete. I added deleteStudent to storage.js.
    const { deleteStudent } = await import("@/lib/storage");
    await deleteStudent(id);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditClassroom(student.classroom || "");
    setEditWorkshop(student.workshop || "");
    setEditSpecialization(student.specialization || "");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updatedStudent = { 
        ...editingStudent, 
        name: editName.trim(),
        classroom: editClassroom,
        workshop: editWorkshop,
        specialization: editSpecialization
      };

    const updated = students.map((s) =>
      s.id === editingStudent.id ? updatedStudent : s
    );
    setStudents(updated);
    await saveStudents([updatedStudent]);
    setEditingStudent(null);
  };

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Students</h1>

      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleBtn} ${mode === "single" ? styles.active : ""}`}
          onClick={() => setMode("single")}
        >
          Single Add
        </button>
        <button
          className={`${styles.toggleBtn} ${mode === "bulk" ? styles.active : ""}`}
          onClick={() => setMode("bulk")}
        >
          Bulk Import
        </button>
      </div>

      {mode === "single" ? (
        <form className={styles.formColumn} onSubmit={handleAdd}>
          <div className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formRow}>
             <input
              type="text"
              className={styles.input}
              placeholder="Classroom (e.g. Intl)"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
            />
            <input
              type="text"
              className={styles.input}
              placeholder="Workshop"
              value={workshop}
              onChange={(e) => setWorkshop(e.target.value)}
            />
            <input
              type="text"
              className={styles.input}
              placeholder="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.addButton}>
            Add Student
          </button>
        </form>
      ) : (
        <div className={styles.bulkForm}>
          <textarea
            className={styles.textarea}
            placeholder="Paste names here, separated by commas or new lines..."
            value={bulkList}
            onChange={(e) => setBulkList(e.target.value)}
          />
          <div className={styles.bulkActions}>
            <button className={styles.addButton} onClick={handleBulkAdd}>
              Import Names
            </button>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {students.map((student) => (
          <div key={student.id} className={styles.item}>
            <div className={styles.info}>
              <span className={styles.name}>{student.name}</span>
              <div className={styles.details}>
                {student.classroom && <span className={styles.tag}>{student.classroom}</span>}
                {student.workshop && <span className={styles.tag}>{student.workshop}</span>}
                {student.specialization && <span className={styles.tag}>{student.specialization}</span>}
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.editButton}
                onClick={() => openEditModal(student)}
                title="Edit Details"
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

      {/* Edit Modal */}
      {editingStudent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Edit Student</h2>
            <form onSubmit={handleSaveEdit}>
              <div className={styles.modalBody}>
                <label>Name</label>
                <input 
                  className={styles.input} 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required 
                />
                
                <label>Classroom</label>
                <input 
                  className={styles.input} 
                  value={editClassroom} 
                  onChange={(e) => setEditClassroom(e.target.value)} 
                />
                
                <label>Workshop</label>
                <input 
                  className={styles.input} 
                  value={editWorkshop} 
                  onChange={(e) => setEditWorkshop(e.target.value)} 
                />
                
                <label>Specialization</label>
                <input 
                  className={styles.input} 
                  value={editSpecialization} 
                  onChange={(e) => setEditSpecialization(e.target.value)} 
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setEditingStudent(null)}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
