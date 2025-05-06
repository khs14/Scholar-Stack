import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase/config.js'; // Adjust this path
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [userFiles, setUserFiles] = useState([]);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    institute: '',
    course: '',
    cgpa: '',
    role: ''
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
        setIsLoading(false);
        
        // Fetch user files after profile is loaded
        fetchUserFiles();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Function to fetch user's uploaded files
  const fetchUserFiles = async () => {
    if (!auth.currentUser) return;
    
    setIsLoadingFiles(true);
    
    try {
      const userDocumentsRef = collection(db, 'users', auth.currentUser.uid, 'documents');
      const q = query(userDocumentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const files = [];
      
      for (const docSnap of querySnapshot.docs) {
        const fileData = docSnap.data();
        
        // If the document has a documentId, fetch full document data from main collection
        if (fileData.documentId) {
          const fullDocRef = doc(db, 'documents', fileData.documentId);
          const fullDocSnap = await getDoc(fullDocRef);
          
          if (fullDocSnap.exists()) {
            const fullDocData = fullDocSnap.data();
            
            // Format the date for display
            const date = fullDocData.createdAt ? 
              new Date(fullDocData.createdAt.seconds * 1000) : new Date();
            
            const formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            
            files.push({
              id: docSnap.id,
              documentId: fileData.documentId,
              name: fileData.fileName,
              subject: fileData.subject,
              fileType: fileData.fileType,
              summary: fileData.summary,
              uploadDate: formattedDate,
              isProcessed: fileData.isProcessed,
              processingStatus: fileData.processingStatus,
              fileURL: fullDocData.fileURL || null
            });
          }
        }
      }
      
      setUserFiles(files);
    } catch (error) {
      console.error('Error fetching user files:', error);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile data to Firestore
  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, userProfile);
      } else {
        await setDoc(userDocRef, {
          ...userProfile,
          email: auth.currentUser.email,
          uid: auth.currentUser.uid,
          createdAt: new Date()
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Function to handle document view
  const handleViewDocument = async (fileURL) => {
    if (fileURL) {
      window.open(fileURL, '_blank');
    }
  };

  // Navigation functions
  const navigateToUpload = () => navigate('/upload');
  const navigateToLibrary = () => navigate('/library');

  if (isLoading) {
    return <div className="profile-container loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
    
      <div className="profile-content">
        <div className="profile-header">
          <h1>User Profile</h1>
          <div className="user-email">{auth.currentUser?.email}</div>
        </div>

        {/* Profile Details Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Profile Details</h2>
            {!isEditing ? (
              <button 
                className="edit-button" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button 
                className="save-button" 
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            )}
          </div>

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userProfile.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="middleName">Middle Name (Optional)</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={userProfile.middleName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lastName">Last Name (Optional)</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userProfile.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="institute">Institute/Organization*</label>
                <input
                  type="text"
                  id="institute"
                  name="institute"
                  value={userProfile.institute}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="course">Course (Optional)</label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={userProfile.course}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cgpa">CGPA (Optional)</label>
                <input
                  type="text"
                  id="cgpa"
                  name="cgpa"
                  value={userProfile.cgpa}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="role">Role (If working, Optional)</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={userProfile.role}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="profile-section navigation-section">
          <div className="section-header">
            <h2>Document Management</h2>
          </div>
          
          <div className="action-buttons">
            <button 
              className="action-button upload-button" 
              onClick={navigateToUpload}
            >
              Upload Documents
            </button>
            
            <button 
              className="action-button library-button" 
              onClick={navigateToLibrary}
            >
              View Library
            </button>
          </div>
        </div>

        {/* User Files Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Your Uploaded Files</h2>
            <button 
              className="refresh-button" 
              onClick={fetchUserFiles}
              disabled={isLoadingFiles}
            >
              {isLoadingFiles ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          <div className="files-container">
            {isLoadingFiles ? (
              <div className="loading-files">Loading your documents...</div>
            ) : userFiles.length > 0 ? (
              <div className="file-list">
                {userFiles.map((file) => (
                  <div key={file.id} className="file-item">
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-info">
                        <span className="file-type">{file.fileType}</span>
                        <span className="file-subject">{file.subject}</span>
                        <span className="file-date">{file.uploadDate}</span>
                      </div>
                      <div className="file-status">
                        Status: 
                        <span className={`status-badge ${file.isProcessed ? 'status-completed' : 'status-pending'}`}>
                          {file.isProcessed ? 'Processed' : 'Processing'}
                        </span>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button 
                        className="view-button" 
                        onClick={() => handleViewDocument(file.fileURL)}
                        disabled={!file.fileURL}
                      >
                        View PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-files">
                <p>You haven't uploaded any files yet.</p>
                <button 
                  className="action-button upload-button" 
                  onClick={navigateToUpload}
                >
                  Upload Your First Document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;