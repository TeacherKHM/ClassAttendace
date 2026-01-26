import { supabase } from './supabase';

export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching students:', error.message || error);
    return [];
  }
  return data;
};

export const saveStudents = async (students) => {
  // Map students to ensure IDs are either omitted (for new ones) or valid UUIDs.
  // The app currently uses Date.now().toString() for IDs, which will fail for UUID columns.
  const dataToUpsert = students.map(s => {
    const { id, ...rest } = s;
    // If id is not a valid UUID (e.g. from Date.now()), we omit it to let Supabase generate one.
    const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    return isUUID ? { id, ...rest } : rest;
  });

  const { error } = await supabase
    .from('students')
    .upsert(dataToUpsert);
  
  if (error) console.error('Error saving students:', error.message || error);
};

export const deleteStudent = async (id) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Error deleting student:', error.message || error);
};

export const getAttendance = async () => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*');
  
  if (error) {
    console.error('Error fetching attendance:', error.message || error);
    return {};
  }
  
  // Transform flat records into the object structure the app expects: { date: { studentId: status } }
  const formatted = data.reduce((acc, record) => {
    if (!acc[record.date]) acc[record.date] = {};
    // Database uses lowercase, UI uses Capitalized for some styles.
    // We'll normalize to Capitalized for the UI if needed, or keep lowercase and map in CSS.
    // Given the previous CSS used status.toLowerCase(), keeping it lowercase is fine, 
    // but the UI buttons use 'Present' etc.
    const status = record.status.charAt(0).toUpperCase() + record.status.slice(1);
    acc[record.date][record.student_id] = status;
    return acc;
  }, {});
  
  return formatted;
};

export const getAttendanceForDate = async (date) => {
  const all = await getAttendance();
  return all[date] || {};
};

export const saveAttendanceForDate = async (date, records) => {
  // records is { studentId: status }
  const dataToUpsert = Object.entries(records).map(([student_id, status]) => ({
    date,
    student_id,
    status: status.toLowerCase() // Enum is lowercase: 'present', 'late', etc.
  }));

  const { error } = await supabase
    .from('attendance')
    .upsert(dataToUpsert, { onConflict: 'student_id,date' });
  
  if (error) console.error('Error saving attendance:', error.message || error);
};

export const getPreceptoria = async () => {
  const { data, error } = await supabase
    .from('preceptoria')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching preceptoria:', error.message || error);
    return {};
  }

  // Transform into { studentId: [records] }
  const formatted = data.reduce((acc, record) => {
    if (!acc[record.student_id]) acc[record.student_id] = [];
    const normalizedRecord = {
      ...record,
      type: record.type.charAt(0).toUpperCase() + record.type.slice(1) // 'student' -> 'Student'
    };
    acc[record.student_id].push(normalizedRecord);
    return acc;
  }, {});

  return formatted;
};

export const getStudentPreceptoria = async (studentId) => {
  const { data, error } = await supabase
    .from('preceptoria')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching student preceptoria:', error.message || error);
    return [];
  }
  return data.map(record => ({
    ...record,
    type: record.type.charAt(0).toUpperCase() + record.type.slice(1)
  }));
};

export const addStudentPreceptoria = async (studentId, record) => {
  const { error } = await supabase
    .from('preceptoria')
    .insert([{
      student_id: studentId,
      date: record.date,
      type: record.type.toLowerCase(), // Enum is 'student' or 'family'
      notes: record.notes
    }]);
  
  if (error) console.error('Error adding preceptoria record:', error.message || error);
};

export const getSocialAction = async () => {
  const { data, error } = await supabase
    .from('social_action')
    .select('*');
  
  if (error) {
    console.error('Error fetching social action:', error.message || error);
    return {};
  }

  // Transform into { studentId: record }
  const formatted = data.reduce((acc, record) => {
    acc[record.student_id] = record;
    return acc;
  }, {});

  return formatted;
};

export const saveSocialAction = async (studentId, record) => {
  const { error } = await supabase
    .from('social_action')
    .upsert({
      student_id: studentId,
      place: record.place,
      acceptance_letter: record.acceptance_letter,
      unit1_hours: record.unit1_hours || 0,
      unit2_hours: record.unit2_hours || 0,
      unit3_hours: record.unit3_hours || 0,
      updated_at: new Date().toISOString()
    }, { onConflict: 'student_id' });
  
  if (error) console.error('Error saving social action record:', error.message || error);
};
