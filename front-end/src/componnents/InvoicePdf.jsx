import React from 'react';

const InvoicePdf = ({ invoice, reportRef, generatePdf }) => {
  return (
    <>
      <div ref={reportRef}>
        <div className="border-4 border-green-600 bg-gray-50 p-4">
          <div className="rounded-md">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">ScrewFast Ltd</h1>
                <p className="text-gray-600">123 Star Road</p>
                <p className="text-gray-600">07494 123 456</p>
                <p className="text-gray-600">info@screwfast.com</p>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">INVOICE</h1>
                <p className="text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
                <p className="text-gray-600">Date: {invoice.invoiceDate}</p>
                <p className="text-gray-600">Due Date: {invoice.invoiceDueDate}</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-2 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Bill To:</h2>
            <p className="text-gray-600">{invoice.clientName}</p>
            <p className="text-gray-600">{invoice.clientAddress}</p>
            <p className="text-gray-600">{invoice.clientPostcode}</p>
            <p className="text-gray-600">{invoice.clientPhone}</p>
          </div>
          <div className="container mx-auto p-1 grid grid-cols-4 md:grid-cols-4 gap-2">
            <div className="tile col-span-1">
              <h1 className="tile-marker">Items</h1>
            </div>
            <div className="tile col-span-1">
              <h1 className="tile-marker">Qty</h1>
            </div>
            <div className="tile col-span-1">
              <h1 className="tile-marker">Price</h1>
            </div>
            <div className="tile col-span-1">
              <h1 className="tile-marker">Total</h1>
            </div>
          </div>
          {invoice.items.map((item, index) => (
            <div key={index} className="border-4 border-blue-60 grid grid-cols-4 md:grid-cols-4 gap-2 p-2">
              <div className="tile col-span-1">
                {item.item}
              </div>
              <div className="tile col-span-1">
                {item.quantity}
              </div>
              <div className="tile col-span-1">
                {item.price}
              </div>
              <div className="tile col-span-1">
                {(item.quantity * item.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="text-right mb-8">
          <div className="flex justify-end">
            <span className="font-semibold mr-4">Grand Total: £{invoice.grandTotal}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="flex justify-end col-span-1 md:col-span-3">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={generatePdf}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default InvoicePdf;