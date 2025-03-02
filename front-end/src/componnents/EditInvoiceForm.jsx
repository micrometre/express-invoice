import React from 'react';
import InvoiceDeleter from './InvoiceDeleter';
import BottomNavbar from './BottomNavbar';
const EditInvoiceForm = ({
  invoice,
  handleFieldChange,
  handleItemChange,
  handleSubmit,
  calculateGrandTotal,
  handleDeleteSuccess,
  handleDeleteFailure,
}) => {
  return (
    <>
    <form onSubmit={handleSubmit} className="border-sky-600 bg-red-100">
      <table className="table px-4 w-full rounded-md border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Invoice Number</th>
            <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Invoice Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                value={invoice.invoiceNumber}
                onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                value={invoice.invoiceDate}
                onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Due Date</th>
            <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Client Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                value={invoice.invoiceDueDate}
                onChange={(e) => handleFieldChange('invoiceDueDate', e.target.value)}
              />
            </td>
            <td>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                type="text"
                value={invoice.clientName}
                onChange={(e) => handleFieldChange('clientName', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Client Postcode</th>
            <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                value={invoice.clientPostcode}
                onChange={(e) => handleFieldChange('clientPostcode', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                value={invoice.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="w-full">
        <div className="container m-1 grid grid-cols-4 grid-rows-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
          <div className="tile bg-lime-600 lg:col-span-1 lg:col-start-1">
            <h1 className="tile-marker">Items</h1>
          </div>
          <div className="tile bg-green-600">
            <h1 className="tile-marker">Qty</h1>
          </div>
          <div className="tile bg-emerald-500">
            <h1 className="tile-marker">Price</h1>
          </div>
          <div className="tile bg-teal-500">
            <h1 className="tile-marker">Total</h1>
          </div>
        </div>
      </div>
      <div className="border-4 border-blue-600 justify-between items-start mb-8">
        <div className="border-4 border-green-600 bg-white shadow-lg rounded-md">
          <div className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden">
            {invoice.items.map((item, index) => (
              <div key={index} className="container m-1 grid grid-cols-4 grid-rows-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
                <div>
                  <input
                    type="text"
                    className="w-20 border p-2"
                    value={item.item}
                    onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-20 border p-2"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="w-20 border p-2"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    step="0.01"
                  />
                </div>
                <div>{(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="text-right mb-8">
            <div className="flex justify-end">
              <span className="font-semibold mr-4">Grand Total: £{calculateGrandTotal()}</span>
            </div>
          </div>
          <div>
            <ul>
              <li key={invoice.id}>
                {invoice.className}
                <InvoiceDeleter
                  invoiceId={invoice.id}
                  onDeleteSuccess={handleDeleteSuccess}
                  onDeleteFailure={handleDeleteFailure}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="mb-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Save Changes
          </button>
        </div>
      </div>
    </form>
    </>
  );
};

export default EditInvoiceForm;