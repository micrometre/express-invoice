import React from 'react';

const InvoicePdf = ({ invoice, reportRef, generatePdf }) => {
  return (
    <div ref={reportRef}>
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={generatePdf}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePdf;