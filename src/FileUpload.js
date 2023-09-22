import React, { useState } from 'react';
import './FileUploadPage.css';

const FileUploadPage = ({ handleFileUpload }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    setLoading(true);

    try {
      // Pass the original file object and its name to the parent component
      await handleFileUpload({ file, originalFileName: file.name });
      setMessage('File uploaded and converted successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Error converting file.');
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="main">
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button
        className="upload-label"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload Excel File'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUploadPage;
