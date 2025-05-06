import React from 'react';
import Navbar from '../components/Navbar'; // Import the existing Navbar component
import './Terms.css'; // Import the CSS file
import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {window.scrollTo(0, 0);}, []);
  return (
    <div className="terms-page">
      <Navbar /> {/* Use the existing Navbar component */}
      <div className="terms-container full-width">
        <h1>Terms of Service</h1>
        <p className="welcome-text">
          Welcome to Scholar Stack! By using our platform, you agree to the following terms:
        </p>
        
        <section className="terms-section">
          <h2>1. User Responsibilities</h2>
          <p>
            You are responsible for uploading only original or properly attributed academic content. 
            Plagiarism, copyright violations, and inappropriate materials are strictly prohibited.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>2. Content Review</h2>
          <p>
            All uploaded documents are reviewed for quality, originality, and academic relevance. 
            We reserve the right to reject or remove any content at our discretion.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>3. Service Hours and Rewards</h2>
          <p>
            Service hours or rewards are based on estimated time and effort for creating or compiling notes. 
            Misuse or falsification will lead to account suspension.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>4. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the platform means you agree to the latest version.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;