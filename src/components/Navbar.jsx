import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config'; // Firebase auth import
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Scholar Stack Logo" />
          </Link>
          <div className="brand-text">
            <Link to="/" className="brand-link">
              <h1>Scholar Stack</h1>
            </Link>
            <span className="beta-badge">BETA</span>
          </div>
        </div>

        <button className="mobile-nav-toggle" onClick={toggleNav} aria-label="Toggle navigation menu">
          <span className={`hamburger ${isNavOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-links ${isNavOpen ? 'show' : ''}`}>
          <Link to="/upload">Upload Notes</Link>
          <Link to="/library">Library</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact Us</Link>

          {!user ? (
            <>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
              <Link to="/login" className="login-btn">Log In</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="profile-btn">Profile</Link>
              <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
