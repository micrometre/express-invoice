// App.js (jspdf example)
import React, { useRef } from 'react';
import jsPDF from 'jspdf';

function App() {
  const reportRef = useRef(null);

  const generatePdf = () => {
    const doc = new jsPDF();

    // Basic text
    doc.text("Hello, this is a simple PDF!", 20, 20);

    // Add content from a React component (limited styling)
    const reportContent = reportRef.current.innerHTML;
    doc.html(reportContent, {
        callback: function (doc) {
          doc.save('simple-report.pdf');
        },
        x: 15,
        y: 40, // Adjust vertical position
        width: 170, // Adjust width as needed
        windowWidth: 650 // Adjust window width
    });
  };

  return (
    <div>
      <h1>jsPDF Example</h1>

      {/* Content to be included in the PDF (limited styling) */}
      <div ref={reportRef}>
        <h2>Report Title</h2>
        <p>This is some report content.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>

      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
}

export default App;