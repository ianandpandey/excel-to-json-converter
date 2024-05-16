import React, { useState } from 'react';
import './FileUploadPage.css';

const FileUploadPage = ({ handleFileUpload }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
    setMessage('');
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('Please select at least one file.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      for (const file of files) {
        await handleFileUpload({ file, originalFileName: file.name });
      }
      setMessage('Files uploaded and converted successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Error converting files.');
    } finally {
      setLoading(false);
      setFiles([]);
    }
  };

  return (
    <div className='main'>
      <input
        type='file'
        accept='.xlsx,.xls'
        onChange={handleFileChange}
        multiple
      />
      <button
        className='upload-label'
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload Excel Files'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUploadPage;
