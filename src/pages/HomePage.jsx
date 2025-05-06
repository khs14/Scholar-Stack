import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Slideshow from '../components/Slideshow';
import FAQ from '../components/FAQ';
import './HomePage.css';

function HomePage() {
  return (
    <div className="app-container">
      <div className="homepage">
        <Navbar /> 
        <main>
          <Hero />
          <Slideshow />
          <FAQ />
        </main>
      </div>
    </div>
  );
}

export default HomePage;