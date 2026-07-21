import React, { useState } from 'react';
import { createStudent } from '../services/api';

export default function AddStudentForm({ onStudentAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: '',
    grade_score: '',
    risk_score: '',
    risk_level: 'Low',
    suggested_intervention: 'None Needed'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sends a POST request to your Django server to save it in PostgreSQL
      const newStudent = await createStudent(formData);
      alert('Student record successfully added to database!');

      // Clear form
      setFormData({
        name: '', email: '', attendance: '', grade_score: '', risk_score: '', risk_level: 'Low', suggested_intervention: 'None Needed'
      });

      if (onStudentAdded) onStudentAdded(newStudent); // Refresh parent list
    } catch (err) {
      console.error('Failed to create student:', err);
      setError('Failed to save student record. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
      <h3>Add New Student Record</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
        <div>
          <label>Student Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Attendance (%):</label>
          <input type="number" name="attendance" value={formData.attendance} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Avg Grade Score:</label>
          <input type="number" name="grade_score" value={formData.grade_score} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>AI Risk Score (0-100):</label>
          <input type="number" name="risk_score" value={formData.risk_score} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Status Level:</label>
          <select name="risk_level" value={formData.risk_level} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>
        <div>
          <label>Suggested Intervention:</label>
          <input type="text" name="suggested_intervention" value={formData.suggested_intervention} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <button type="submit" disabled={loading} style={{ background: '#00D4AA', color: '#0F1B3C', fontWeight: 'bold', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {loading ? 'Saving to Database...' : 'Save Student Data'}
          </button>
        </div>
      </form>
    </div>
  );
}