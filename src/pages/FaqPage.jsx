import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomePage from './HomePage';

function FaqPage() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the FAQ section whenever the location changes to /faq
    if (location.pathname === '/faq') {
      const faqElement = document.getElementById('faq-return');
      if (faqElement) {
        faqElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return <HomePage />;
}

export default FaqPage;