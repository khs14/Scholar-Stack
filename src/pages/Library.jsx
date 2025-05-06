import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './Library.css';

const Library = () => {
  const [notes, setNotes] = useState([]);
  const COMMON_REPORT_LINK = 'YOUR_COMMON_GOOGLE_FORM_LINK'; // Static link

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesCollection = collection(db, 'notes');
        const notesSnapshot = await getDocs(notesCollection);
        const notesList = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotes(notesList);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleReport = () => {
    window.open(COMMON_REPORT_LINK, '_blank');
  };

  return (
    <div className="library-container">
      <h1>Community Notes</h1>
      <div className="notes-list">
        {notes.map(note => (
          <div className="note-item" key={note.id}>
            <p><strong>File Name:</strong> {note.fileName}</p>
            <p><strong>Subject:</strong> {note.subject}</p>
            {note.uploaderEmail && (
              <p><strong>Uploaded By:</strong> {note.uploaderEmail}</p>
            )}
            <a href={note.fileURL} target="_blank" rel="noopener noreferrer">View Note</a>
            <button onClick={handleReport}>Report</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;