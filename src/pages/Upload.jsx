import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase/config"; // Make sure storage is exported from config
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./Upload.css";

const Upload = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    institute: "",
    course: "",
    cgpa: "",
    role: "",
    email: ""
  });

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      if (!auth.currentUser) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }
      
      setUser(auth.currentUser);
      setIsLoggedIn(true);
      
      // Fetch user profile data from Firestore
      await fetchUserProfile(auth.currentUser.uid);
    };

    checkAuth();
  }, []);

  // Function to fetch user profile from Firestore
  const fetchUserProfile = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          ...userData,
          email: auth.currentUser.email // Get email from auth object
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [showInLibrary, setShowInLibrary] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      setFileName("");
      setError("No file selected.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setFileName("");
      setError("Only PDF files are allowed.");
      return;
    }

    if (selectedFile.size < 4 * 1024) {
      setFile(null);
      setFileName("");
      setError("The selected PDF appears to be empty or too small to be valid.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setFileName("");
      setError("The PDF must be up to 10MB");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
  };

  // Function to add document to process queue
  const addToProcessQueue = async (documentId, documentData, userDetails) => {
    try {
      // Create process queue entry
      const queueData = {
        documentId: documentId,
        userId: user.uid,
        userEmail: user.email,
        fileName: documentData.fileName,
        originalFileName: documentData.originalFileName,
        fileType: documentData.fileType,
        subject: documentData.subject,
        summary: documentData.summary,
        filePath: documentData.filePath,
        fileURL: documentData.fileURL,
        fileSize: documentData.fileSize,
        status: "pending",
        priority: "normal",
        attempts: 0,
        maxAttempts: 3,
        includeUserDetails: !!userDetails,
        userDetails: userDetails,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        scheduledFor: serverTimestamp(), // Process as soon as possible
        processingStartedAt: null,
        processingCompletedAt: null,
        errorMessage: null
      };

      // Add to the process queue collection
      await addDoc(collection(db, "processQueue"), queueData);

      console.log("Document added to process queue successfully");
    } catch (err) {
      console.error("Error adding document to process queue:", err);
      throw err; // Re-throw to handle in the calling function
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    if (!fileType.trim()) {
      setError("Please enter a file type");
      return;
    }

    if (!summary.trim()) {
      setError("Please enter a brief summary");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setUploadProgress(0);

    try {
      // 1. Upload PDF to Firebase Storage
      const userId = user.uid;
      const timestamp = Date.now();
      const storageFilePath = `pdfs/${userId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storageFilePath);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Monitor upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          setError("Error uploading file: " + error.message);
          setIsSubmitting(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // 2. Create document record in Firestore
          const userDetails = showInLibrary ? {
            firstName: userProfile.firstName || null,
            middleName: userProfile.middleName || null,
            lastName: userProfile.lastName || null,
            institute: userProfile.institute || null,
            course: userProfile.course || null,
            role: userProfile.role || null
          } : null;
          
          const documentData = {
            fileName: fileName,
            originalFileName: file.name,
            fileType: fileType,
            subject: subject,
            summary: summary,
            filePath: storageFilePath,
            fileURL: downloadURL,
            fileSize: file.size,
            uploadedBy: userId,
            userDetails: userDetails,
            showInLibrary: showInLibrary,
            isProcessed: false, // Set to false by default
            processingStatus: "queued", // Changed from "pending" to "queued"
            isValid: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          
          // Add to documents collection
          const docRef = await addDoc(collection(db, "documents"), documentData);
          
          // Also add to user's documents subcollection for easy access
          await setDoc(doc(db, "users", userId, "documents", docRef.id), {
            documentId: docRef.id,
            fileName: fileName,
            fileType: fileType,
            subject: subject,
            summary: summary,
            isProcessed: false,
            processingStatus: "queued", // Changed from "pending" to "queued"
            createdAt: serverTimestamp()
          });
          
          // 3. Add document to process queue
          await addToProcessQueue(docRef.id, documentData, userDetails);
          
          setSuccess("Study notes uploaded successfully! Your document has been added to the processing queue and results will be shared via email.");
          
          // Reset form fields
          setFile(null);
          setFileName("");
          setFileType("");
          setSubject("");
          setSummary("");
          setShowInLibrary(true);
          setUploadProgress(0);
          
          // Wait a bit before redirecting to give user time to see the success message
          setTimeout(() => {
            navigate('/profile');
          }, 10000); // Redirect after 10 seconds
        }
      );
    } catch (err) {
      setError("Error uploading PDF: " + err.message);
      console.error("Upload error:", err);
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="pdf-upload-container">
        <h2>Access Required</h2>
        <div className="not-logged-in">
          <p>Please sign up or log in to upload PDF documents.</p>
          <div className="auth-buttons">
            <a href="/login" className="login-btn">Log In</a>
            <a href="/signup" className="signup-btn">Sign Up</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-upload-container">
      <h2>Upload Study Notes</h2>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          <p>{success}</p>
          <button 
            onClick={() => navigate('/profile')}
            className="view-profile-btn"
          >
            View My Profile
          </button>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="user-profile-section">
            <div className="user-profile-info">
              <p>Uploading as: <strong>{userProfile.firstName} {userProfile.middleName} {userProfile.lastName}</strong></p>
              <p className="profile-details">Institute: {userProfile.institute} | Course: {userProfile.course}</p>
              <p className="certificate-note">This name will appear on any certificates issued</p>
            </div>
            <button 
              type="button" 
              onClick={() => navigate('/profile')} 
              className="profile-nav-btn"
            >
              Edit Profile
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="pdf-file">Select PDF</label>
            <div className="file-input-container">
              <input
                type="file"
                id="pdf-file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
                disabled={isSubmitting}
              />
              <label htmlFor="pdf-file" className="file-input-label">
                {fileName || "Choose PDF file"}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter the subject (e.g., Mathematics, Chemistry)"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="file-type">Document Type</label>
            <input
              type="text"
              id="file-type"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              placeholder="Enter document type (e.g., Lecture Notes, Research)"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="summary">Brief Summary</label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter a brief summary of the content"
              rows="4"
              disabled={isSubmitting}
              required
            ></textarea>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="show-in-library"
              checked={showInLibrary}
              onChange={(e) => setShowInLibrary(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="show-in-library">
              Display my name and details as author details when this document is shown in the library
            </label>
          </div>

          {isSubmitting && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p>{uploadProgress}% Uploaded</p>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting || !file}
          >
            {isSubmitting ? "Uploading..." : "Upload Study Notes"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Upload;