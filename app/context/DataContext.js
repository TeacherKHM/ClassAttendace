"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStudents, getAttendance, getPreceptoria } from "@/lib/storage";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [preceptoria, setPreceptoria] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    try {
      const [studentData, attendanceData, preceptoriaData] = await Promise.all([
        getStudents(),
        getAttendance(),
        getPreceptoria()
      ]);
      setStudents(studentData);
      setAttendance(attendanceData);
      setPreceptoria(preceptoriaData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data in context:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Context value includes data and the refresh trigger
  const value = {
    students,
    attendance,
    preceptoria,
    loading,
    error,
    refreshData,
    setAttendance // Allow local updates for immediate feedback
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
