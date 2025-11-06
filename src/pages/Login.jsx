import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simulate login and role assignment
    const role = login(email, password);

    if (role) {
      navigate(`/dashboard/${role}`);
    } else {
      setError('Invalid Email/Phone or Password.');
    }
  };

  return (
    <div style={containerStyle}>
      [cite_start]<h2>Login / Subscribe to Upskilling and Outsourcing [cite: 68]</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input
          type="text"
          placeholder="Email/phone number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>

      <div style={subscriptionNoteStyle}>
        [cite_start]<p>Your subscription plan (Free, Premium, Platinum) [cite: 68] and payment interface are handled after a successful login.</p>
        <p>Test accounts: consumer/consumer, admin/admin, tutor/tutor</p>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd'
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const subscriptionNoteStyle = {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
    fontSize: '0.9em'
}

export default Login;