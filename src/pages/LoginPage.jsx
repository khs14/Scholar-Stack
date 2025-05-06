import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Login successful
      console.log('Login successful:', userCredential.user);
      
      // Reset form
      setFormData({
        email: '',
        password: ''
      });
      
      // Redirect to dashboard or home page
      navigate('/profile');
    } catch (error) {
      // Handle specific error codes
      switch(error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        default:
          setError('Failed to sign in. Please try again.');
          console.error('Login error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-width-wrapper">
      <div className="login-page">
        <div className="login-background">
          {/* Background elements can be added here */}
          <div className="background-shape shape1"></div>
          <div className="background-shape shape2"></div>
          <div className="background-shape shape3"></div>
        </div>
        
        <div className="login-container">
          <div className="login-box">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Please sign in to your account</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Enter your email" 
                  required 
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Enter your password" 
                    required 
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn" 
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="primary-btn login-form-btn"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="login-footer">
              <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
              <p><Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;