import React, { useState, useEffect } from 'react';
import './Slideshow.css';
import slide_1 from '../assets/slide_1.png';
import slide_2 from '../assets/slide_2.png';
import slide_3 from '../assets/slide_3.png';
import slide_4 from '../assets/slide_4.png';

function Slideshow() {
  const slides = [
    { 
      image: slide_1, 
      caption: 'Original notes earn the most community service hours' 
    },
    { 
      image: slide_2, 
      caption: 'Certificates are given after originality verification' 
    },
    { 
      image: slide_3, 
      caption: 'All subjects and courses are welcome' 
    },
    { 
      image: slide_4, 
      caption: 'Notes must be your own original work' 
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(current => (current === slides.length - 1 ? 0 : current + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="slideshow-section">
      <div className="container">
        <h2>Valid Documents Guidelines</h2>
        <div className="slideshow">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={index === current ? 'slide active' : 'slide'}
            >
              <div className="slide-content">
                <img src={slide.image} alt={`Slide ${index + 1}`} />
                <p className="slide-caption">{slide.caption}</p>
              </div>
            </div>
          ))}
          <div className="slide-indicators">
            {slides.map((_, index) => (
              <button 
                key={index} 
                className={index === current ? 'indicator active' : 'indicator'}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Slideshow;