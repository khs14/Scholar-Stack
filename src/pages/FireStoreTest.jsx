import React, { useState, useEffect } from "react";
import { db } from "../firebase/config"; // Your Firebase config file
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

function FirestoreTest() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("");

  // Add a note to Firestore
  const addNote = async (e) => {
    e.preventDefault();
    
    if (!note.trim()) return;
    
    try {
      setStatus("Adding note...");
      await addDoc(collection(db, "notes"), {
        text: note,
        createdAt: new Date()
      });
      setNote("");
      setStatus("Note added successfully!");
      fetchNotes(); // Refresh notes
    } catch (error) {
      console.error("Error adding note:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  // Fetch notes from Firestore
  const fetchNotes = async () => {
    try {
      setStatus("Fetching notes...");
      const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const notesList = [];
      querySnapshot.forEach((doc) => {
        notesList.push({ 
          id: doc.id, 
          ...doc.data(), 
          createdAt: doc.data().createdAt.toDate().toLocaleString() 
        });
      });
      
      setNotes(notesList);
      setStatus(notesList.length ? "Notes loaded successfully!" : "No notes found");
    } catch (error) {
      console.error("Error fetching notes:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>Firestore Test</h2>
      
      <form onSubmit={addNote}>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter a note"
        />
        <button type="submit">Add Note</button>
      </form>
      
      <p>{status}</p>
      
      <h3>Notes from Firestore:</h3>
      {notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              {note.text} - {note.createdAt}
            </li>
          ))}
        </ul>
      )}
      
      <button onClick={fetchNotes}>Refresh Notes</button>
    </div>
  );
}

export default FirestoreTest;