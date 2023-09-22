import React, { useState } from 'react';
import './App.css'; // Import your CSS file
import FileUploadPage from './FileUpload';
import ResultPage from './ResultPage';
import * as XLSX from 'xlsx';

// ... (your existing code)

const App = () => {
  const [jsonResult, setJsonResult] = useState(null);
  const [downloadableData, setDownloadableData] = useState(null);
  const [downloadButtonEnabled, setDownloadButtonEnabled] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('');

  const handleFileUpload = async ({ file, originalFileName }) => {
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

      setOriginalFileName(originalFileName);
      setJsonResult(jsonResult);
      setDownloadableData(jsonResult);
      setDownloadButtonEnabled(true);
    };
    reader.readAsBinaryString(file);
  };

  const handleDownload = () => {
    if (downloadableData) {
      const jsonBlob = new Blob([JSON.stringify(downloadableData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement('a');
      // Use the original file name for the downloaded JSON file
      a.href = url;
      a.download = originalFileName.replace(/\s/g, '_').toLowerCase() + '.json'; // Add .json extension
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Excel to JSON Converter</h1>
      <div>
        <FileUploadPage handleFileUpload={handleFileUpload} />
      </div>
      <ResultPage
        jsonResult={jsonResult}
        downloadButtonEnabled={downloadButtonEnabled}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default App;

// export default App;
