import React, { useState, useEffect } from 'react';
import './App.css';
import logoImage from './assets/logo.png'; // You'll need to add your logo to assets folder

// Placeholder data for the infographic slides
const infographicSlides = [
  {
    id: 1,
    title: "Class Notes",
    description: "Share your detailed class notes with diagrams and explanations.",
    validationPoints: ["Must be original content", "Include course name and date", "Minimum 3 pages"]
  },
  {
    id: 2,
    title: "Research Summaries",
    description: "Upload summaries of academic papers or research projects.",
    validationPoints: ["Include proper citations", "Summarize key findings", "Add your critical analysis"]
  },
  {
    id: 3,
    title: "Study Guides",
    description: "Create comprehensive study guides for specific subjects.",
    validationPoints: ["Organized by topics", "Include practice questions", "Cover entire syllabus"]
  },
  {
    id: 4,
    title: "Project Documentation",
    description: "Share documentation from academic projects you've completed.",
    validationPoints: ["Include methodology", "Document results", "Explain learning outcomes"]
  },
  {
    id: 5,
    title: "Tutorial Materials",
    description: "Upload tutorials or how-to guides for academic concepts.",
    validationPoints: ["Step-by-step instructions", "Include examples", "Clear explanations"]
  }
];

// FAQ data
const faqItems = [
  {
    question: "How many community service hours can I earn?",
    answer: "You can earn 1-5 hours per approved submission, depending on quality, originality, and effort."
  },
  {
    question: "What types of documents are accepted?",
    answer: "We accept class notes, study guides, research summaries, project documentation, and tutorial materials."
  },
  {
    question: "How is my submission evaluated?",
    answer: "Our reviewers evaluate submissions based on originality, thoroughness, accuracy, and presentation."
  },
  {
    question: "How soon will I receive my community service certificate?",
    answer: "Certificates are issued within 7 days of submission approval."
  },
  {
    question: "Can I upload group work?",
    answer: "Yes, but please clearly indicate all contributors so hours can be allocated appropriately."
  }
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-change slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % infographicSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logoImage} alt="Scholar Stack Logo" className="logo" />
          <div className="brand-container">
            <h1 className="brand-name">Scholar Stack</h1>
            <span className="beta-tag">BETA</span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#upload">Upload a Doc</a>
          <a href="#library">Library</a>
          <a href="#faq">FAQ</a>
          <a href="#signup" className="signup-btn">Sign Up</a>
          <a href="#login" className="login-btn">Log In</a>
        </div>
      </nav>
      
      {/* Hero Section with Description */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Turn Your Academic Notes Into Community Service Hours</h2>
          <p>Upload your original academic materials, help fellow students, and earn verified community service hours.</p>
          <a href="#upload" className="cta-button">Start Uploading</a>
        </div>
        
        {/* Flow Chart Infographic */}
        <div className="flow-chart">
          <div className="flow-step">
            <div className="step-number">1</div>
            <div className="step-text">Create & Upload Notes</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">2</div>
            <div className="step-text">Get Reviewed</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">3</div>
            <div className="step-text">Earn Service Hours</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-number">4</div>
            <div className="step-text">Receive Certificate</div>
          </div>
        </div>
      </section>
      
      {/* Infographic Slides */}
      <section className="infographic-section">
        <h2>What Can You Upload?</h2>
        <div className="slides-container">
          {infographicSlides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`slide ${index === currentSlide ? "active" : ""}`}
            >
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              <div className="validation-points">
                <h4>Validation Requirements:</h4>
                <ul>
                  {slide.validationPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slide Navigation Dots */}
        <div className="slide-dots">
          {infographicSlides.map((_, index) => (
            <button 
              key={index} 
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Scholar Stack. All rights reserved.</p>
        <div className="footer-links">
          <a href="#terms">Terms</a>
          <a href="#privacy">Privacy</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;