const STORAGE_KEYS = {
  STUDENTS: 'attendance_app_students',
  ATTENDANCE: 'attendance_app_records',
  PRECEPTORIA: 'attendance_app_preceptoria',
};

const DEFAULT_STUDENTS = [
  { id: '1', name: 'Alice Johnson', classroom: 'International', workshop: 'Art', specialization: 'Design' },
  { id: '2', name: 'Bob Smith', classroom: 'GAC', workshop: 'Music', specialization: 'Performance' },
  { id: '3', name: 'Charlie Brown', classroom: 'International', workshop: 'Coding', specialization: 'Web' },
  { id: '4', name: 'Diana Prince', classroom: 'GAC', workshop: 'Sports', specialization: 'Leadership' },
  { id: '5', name: 'Evan Wright', classroom: 'International', workshop: 'Debate', specialization: 'Law' },
];

export const getStudents = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  }
  return JSON.parse(stored);
};

export const saveStudents = (students) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const getAttendance = () => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return stored ? JSON.parse(stored) : {};
};

export const saveAttendance = (attendance) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
};

export const getAttendanceForDate = (date) => {
  const all = getAttendance();
  return all[date] || {};
};

export const saveAttendanceForDate = (date, records) => {
  const all = getAttendance();
  all[date] = records;
  saveAttendance(all);
};

export const getPreceptoria = () => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEYS.PRECEPTORIA);
  return stored ? JSON.parse(stored) : {};
};

export const savePreceptoria = (preceptoria) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PRECEPTORIA, JSON.stringify(preceptoria));
};

export const getStudentPreceptoria = (studentId) => {
  const all = getPreceptoria();
  return all[studentId] || [];
};

export const addStudentPreceptoria = (studentId, record) => {
  const all = getPreceptoria();
  const current = all[studentId] || [];
  all[studentId] = [record, ...current];
  savePreceptoria(all);
};
