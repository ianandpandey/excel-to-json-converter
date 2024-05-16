import React from 'react';

const ResultPage = ({ jsonResult, downloadButtonEnabled, handleDownload }) => {
  return (
    <div>
      {jsonResult.length > 0 && (
        <div>
          <h2>Converted Results</h2>
          {jsonResult.map((result, index) => (
            <div key={index}>
              <h3>{result.fileName}</h3>
              <pre>{JSON.stringify(result.jsonData, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
      {downloadButtonEnabled && (
        <button onClick={handleDownload}>Download All as JSON</button>
      )}
    </div>
  );
};

export default ResultPage;
