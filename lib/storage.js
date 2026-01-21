const STORAGE_KEYS = {
  STUDENTS: 'attendance_app_students',
  ATTENDANCE: 'attendance_app_records',
};

const DEFAULT_STUDENTS = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'Diana Prince' },
  { id: '5', name: 'Evan Wright' },
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
