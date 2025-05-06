import React from 'react';
import Navbar from '../components/Navbar'; // Import the existing Navbar component
import './Contact.css'; // Import the CSS file
import { useEffect } from "react";
const Contact = () => {
  useEffect(() => {window.scrollTo(0, 0);}, []);
  return (
    <div className="contact-page">
      <Navbar /> {/* Use the existing Navbar component */}
      <div className="contact-container full-width">
        <h1>Contact Us</h1>
        
        <section className="contact-section about">
          <h2>About Scholar Stack</h2>
          <p>
            Scholar Stack is a platform where students can upload academic PDFs and earn certificates
            in collaboration with Forever Shashi Foundation for community service hours. 
            The platform also offers an online library where users can view and access 
            the uploaded academic resources.
          </p>
        </section>
        
        <section className="contact-section creator">
          <h2>Created By</h2>
          <div className="creator-info">
            <h3>Kaustubh Hari Sethi</h3>
            <div className="contact-links">
              <a href="mailto:helloscholarstack@gmail.com" className="contact-link email">
                <i className="icon email-icon"></i>
                helloscholarstack@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/kaustubh-hari-sethi/" target="_blank" rel="noopener noreferrer" className="contact-link linkedin">
                <i className="icon linkedin-icon"></i>
                LinkedIn Profile
              </a>
            </div>
          </div>
        </section>
        
        <section className="contact-section collaborate">
          <h2>Collaborate With Us</h2>
          <p>
            We welcome collaboration to improve Scholar Stack! If you're interested in contributing
            to this project, please reach out via email or LinkedIn. Together, we can enhance the platform
            and make it even more beneficial for students and academic communities.
          </p>
        </section>
        
        <section className="contact-section foundation">
          <h2>Forever Shashi Foundation</h2>
          <p>
            Scholar Stack proudly collaborates with Forever Shashi Foundation to provide
            certificates of community service for contributors. By uploading quality academic
            resources, students can earn recognition for their contributions to this educational initiative.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Contact;