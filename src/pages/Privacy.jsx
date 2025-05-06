import React from 'react';
import Navbar from '../components/Navbar'; // Import the existing Navbar component
import './Privacy.css'; // Import the CSS file
import { useEffect } from "react";
const Privacy = () => {
  useEffect(() => {window.scrollTo(0, 0);}, []);
  return (
    <div className="privacy-page">
      <Navbar /> 
      <div className="privacy-container full-width">
        <h1>Privacy Policy</h1>
        <p className="welcome-text">
          At Scholar Stack, your privacy matters. Here's how we handle your data:
        </p>
        
        <section className="privacy-section">
          <h2>1. What We Collect</h2>
          <p>
            We may collect your name, email, institution, uploaded documents, and user activity 
            to provide and improve our services.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>2. How We Use Your Data</h2>
          <ul className="privacy-list">
            <li>To review and verify documents</li>
            <li>To assign community service hours or generate certificates</li>
            <li>To communicate important updates</li>
          </ul>
        </section>
        
        <section className="privacy-section">
          <h2>3. Third-Party Services</h2>
          <p>
            We may use Google Drive and other secure platforms to store documents. 
            Your data is not sold or shared for marketing.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>4. Cookies</h2>
          <p>
            Scholar Stack may use cookies to improve your user experience. 
            You can disable them in your browser settings.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>5. Your Rights</h2>
          <p>
            You can request to view, update, or delete your data anytime by contacting us.
          </p>
        </section>
        
        <p className="closing-text">
          We're committed to keeping your data secure and using it only for educational purposes.
        </p>
      </div>
    </div>
  );
};

export default Privacy;