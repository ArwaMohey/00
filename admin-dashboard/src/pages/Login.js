import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ studentId: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', form);
      if (res.data.role !== 'admin') {
        setError('Access denied: Not an admin');
        return;
      }
      localStorage.setItem('admin', JSON.stringify(res.data));
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Paper elevation={3} style={{ maxWidth: 400, margin: '100px auto', padding: 32 }}>
      <Typography variant="h5" gutterBottom>Admin Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Admin Username"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 16 }}>
          Login
        </Button>
      </form>
    </Paper>
  );
};

export default Login; 