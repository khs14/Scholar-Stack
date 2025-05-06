// FAQ.jsx - Updated with container
import React, { useState } from 'react';
import './FAQ.css';

function FAQ() {
  // FAQ content remains the same
  const faqs = [
    {
      question: "What is meant by original notes?",
      answer:
        "You can upload self-made notes—digital or handwritten—self-solved assignments, project tutorials, competitive exam preparation material, and more. Documents that are plagiarized or provided by educational institutions will not receive certificates."
    },
    {
      question: "What happens if incorrect or plagiarized notes are accepted by mistake?",
      answer:
        "If a document passes the automated checks but is later found to be plagiarized or not original, we reserve the right to invalidate the certificate. The certificate's QR code will be marked as invalid, and the user may be restricted from future uploads."
    },    
    {
      question: "What file formats are accepted?",
      answer:
        "Currently, we only accept PDF files up to 10 MB in size."
    },
    {
      question: "How long does verification take?",
      answer:
        "Our automated algorithm checks the document. The time required depends on the file type and the number of users in the queue. Once verified, the certificate will be sent via email."
    },
    {
      question: "Can I upload notes from any subject?",
      answer:
        "Yes! We accept notes from all academic subjects and levels, from high school through graduate studies. You can also upload notes for competitive exams and entrance test preparation."
    },
    {
      question: "How do I get my community service certificate?",
      answer:
        "You will receive an email with the certificate attached once your notes are successfully verified. If the document fails verification, the reason will also be communicated via email."
    },
    {
      question: "How are the PDFs validated?",
      answer:
        "Notes are checked for originality using plagiarism detection, AI content detection, and other verification methods."
    }
  ];
  

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id = "faq-return" className="faq-section">
      <div className="container">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button 
                className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
