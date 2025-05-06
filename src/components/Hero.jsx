
// Hero.jsx - Updated with container
import React from 'react';
import './Hero.css';
import flowChart from '../assets/flowchart.png';

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1>Upload Notes, Earn Community Service Hours</h1>
          <p>
            Scholar Stack is an academic platform where students can share quality notes and receive 
            community service hours based on originality, quality, and effort.
          </p>
          <div className="hero-buttons">
            <a href="/upload" className="primary-btn">Upload Your Notes</a>
            <a href="/library" className="secondary-btn">Browse Library</a>
          </div>
        </div>
        <div className="flowchart">
          <img src={flowChart} alt="How Scholar Stack Works" />
        </div>
      </div>
    </section>
  );
}

export default Hero;