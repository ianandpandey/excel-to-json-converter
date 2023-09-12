import React, { useState } from 'react';
const XLSX = require('xlsx');

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResult, setJsonResult] = useState(null);
  const [downloadableData, setDownloadableData] = useState(null);
  const [downloadButtonEnabled, setDownloadButtonEnabled] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
  };

  const convertExcelToJson = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Filter out empty rows (rows with no data)
      const filteredData = jsonData.filter((row) =>
        Object.values(row).some(
          (cell) => cell !== undefined && cell !== null && cell !== ''
        )
      );

      const [headers, ...dataRows] = filteredData;
      const jsonResult = dataRows.map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];

          // Remove extraneous double quotes from JSON properties
          if (
            typeof obj[header] === 'string' &&
            obj[header].startsWith('"') &&
            obj[header].endsWith('"')
          ) {
            obj[header] = obj[header].slice(1, -1);
          }
        });
        return obj;
      });

      setJsonResult(jsonResult);
      setDownloadableData(jsonResult);
      setDownloadButtonEnabled(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    setLoading(true);

    try {
      convertExcelToJson(file);
      setMessage('File uploaded and converted successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Error converting file.');
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const handleDownload = () => {
    if (downloadableData) {
      const jsonBlob = new Blob([JSON.stringify(downloadableData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'convertedData.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div className="download-button-container">
        <button
          className="download-button"
          onClick={handleDownload}
          disabled={!downloadButtonEnabled}
        >
          Download JSON
        </button>
      </div>

      <div className="json-display-box">
        {jsonResult && (
          <div>
            <h2>Converted JSON Data:</h2>
            <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
          </div>
        )}
      </div>

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

export default FileUpload;
