import React, { useState } from 'react';
import './SignUp.css';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate email (required)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    
    // Validate password (required)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting to create user with:", formData.email, formData.password);
      
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Get the user ID from the newly created user
      const userId = userCredential.user.uid;
      console.log("User created successfully with ID:", userId);
      
      // Store initial user data in Firestore
      const userDocRef = doc(db, "users", userId);
      
      const userData = {
        email: formData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log("Storing user data in Firestore:", userData);
      await setDoc(userDocRef, userData);
      
      console.log("User registered successfully with ID:", userId);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
      });
      
      // Redirect to profile completion page after short delay
      setTimeout(() => {
        navigate('/login'); // New route for completing profile
      }, 3000);
      
    } catch (error) {
      console.error("Error registering user:", error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: "This email is already registered" });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: "Invalid email format" });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: "Password is too weak" });
      } else {
        setErrors({ form: `Failed to register: ${error.message}` });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="full-width-wrapper">
      <div className="app">
        <div className="signup-container">
          <div className="signup-form-container">
            <div className="signup-header">
              <h1>Join Scholar Stack</h1>
              <p className="signup-description">
                Share academic resources, earn certificates, and contribute to education access through 
                the Forever Shashi Foundation while earning community service hours.
              </p>
            </div>
            
            {errors.form && <div className="error-message">{errors.form}</div>}
            
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-section">
                <h2>Create Your Account</h2>
                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    required
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password <span className="required">*</span></label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                    required
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                  <span className="password-hint">Must be at least 8 characters long</span>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "error" : ""}
                    required
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </div>
              
              <div className="benefits-section">
                <h3>Benefits of Joining Scholar Stack</h3>
                <ul className="benefits-list">
                  <li>
                    <div className="benefit-icon">📚</div>
                    <div className="benefit-text">
                      <strong>Access to Academic Library</strong>
                      <p>Browse and download resources from our growing collection</p>
                    </div>
                  </li>
                  <li>
                    <div className="benefit-icon">🏆</div>
                    <div className="benefit-text">
                      <strong>Earn Certificates</strong>
                      <p>Get recognition for your contributions to the academic community</p>
                    </div>
                  </li>
                  <li>
                    <div className="benefit-icon">⏱️</div>
                    <div className="benefit-text">
                      <strong>Community Service Hours</strong>
                      <p>Upload PDFs to earn verified service hours with Forever Shashi Foundation</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="terms-container">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></label>
              </div>
              
              <button 
                type="submit" 
                className="signup-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Join Scholar Stack"}
              </button>
              
              {submitSuccess && (
                <div className="success-message">
                  Account created successfully! You'll be redirected to complete your profile shortly.
                </div>
              )}
            </form>
            
            <div className="login-link">
              Already have an account? <a href="/login">Log in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;