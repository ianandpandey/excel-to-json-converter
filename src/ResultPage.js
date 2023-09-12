import React from 'react';
import './ResultPage.css';

const ResultPage = ({ jsonResult, downloadButtonEnabled, handleDownload }) => {
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

      {jsonResult && ( // Conditionally render the JSON display box
        <div className="json-display-box">
          <div>
            <h2>Converted JSON Data:</h2>
            <pre className="json-text">
              {JSON.stringify(jsonResult, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
