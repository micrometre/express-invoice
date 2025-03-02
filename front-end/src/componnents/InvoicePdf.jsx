import React from 'react';

const InvoicePdf = ({ invoice, reportRef, generatePdf }) => {
  return (
    <>
      <div ref={reportRef}>
        <div className="border-4 border-green-600 bg-gray-50">
          <div className="px-5 rounded-md">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">ScrewFast Ltd</h1>
                <p className="text-gray-600">123 Star Road</p>
                <p className="text-gray-600">07494 123 456</p>
                <p className="text-gray-600">info@screwfast.com</p>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
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
          <div className="container m-1 grid grid-cols-4 grid-rows-1 gap-6 md:grid-cols-4 lg:grid-cols-4">
            <div className="tile col-span-1 row-start-2 row-end-5 md:col-span-2 lg:col-span-3">
              <h1 className="tile-marker">Items</h1>
            </div>
            <div className="tile col-span-1 row-start-2 row-end-5 md:col-span-1 lg:col-span-2">
              <h1 className="tile-marker">Qty</h1>
            </div>
            <div className="tile col-span-1 row-start-2 row-end-5 md:col-span-2 lg:col-span-3">
              <h1 className="tile-marker mr-10">Price</h1>
            </div>
            <div className="tile col-span-1 row-start-2 row-end-5 bg-gray-10 md:col-span-2 lg:col-span-3">
              <h1 className="tile-marker">Total</h1>
            </div>
          </div>
          {invoice.items.map((item, index) => (
            <div key={index} className="border-4 border-blue-600 grid gap-2 lg:grid-cols-4 lg:grid-rows-2">
              <div className="w-22 tile col-span-1 row-start-2 row-end-5  md:col-span-2 lg:col-span-3">
                {item.item}
              </div>
              <div className="w-24 border p-2 tile col-span-1 row-start-2 row-end-5  md:col-span-2 lg:col-span-3">
                {item.quantity}
              </div>
              <div className="w-24 border p-2 tile col-span-1 row-start-2 row-end-5  md:col-span-2 lg:col-span-3">
                {item.price}
              </div>
              <div className="w-24 border p-2  tile col-span-1 row-start-2 row-end-5  md:col-span-2 lg:col-span-3">
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
    </>
  );
};

export default InvoicePdf;