import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import LogoImg from '/images/logo.jpg'
import InvoiceDeleter from './InvoiceDeleter';
import InvoiceLogo from './InvoiceLogo';
import InvoiceBanner from './InvoiceBanner';
import GridTable from './GridTable';
const EditInvoice = () => {
  const reportRef = useRef(null);
  const { invoiceId } = useParams(); // Get the invoice ID from the URL
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    invoiceDueDate: '',
    clientName: '',
    clientAddress: '',
    clientPostcode: '',
    clientEmail: '',
    clientPhone: '',
    description: '',
    items: [],
    grandTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the invoice data by ID
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`http://192.168.1.130:5000/invoices/${invoiceId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch invoice');
        }
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);


  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text(`${invoiceId}`, 20, 20);
    const reportContent = reportRef.current.innerHTML;
    doc.html(reportContent, {
      callback: function (doc) {
        doc.save('simple-report.pdf');
      },
      x: 15,
      y: 10, // Adjust vertical position
      width: 170, // Adjust width as needed
      windowWidth: 650 // Adjust window width
    });
    console.log(reportContent)
  };

  // Handle input changes for top-level fields (e.g., invoiceNumber, invoiceDate, etc.)
  const handleFieldChange = (field, value) => {
    setInvoice({ ...invoice, [field]: value });
  };

  // Handle input changes for items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    setInvoice({ ...invoice, items: updatedItems });
  };


  const calculateGrandTotal = () => {
    return invoice.items.reduce((total, item) => {
      return total + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
    }, 0).toFixed(2);
  };


  const handleDeleteSuccess = (message, invoiceId) => {
    console.log(message); // "Invoice deleted successfully"
    //setInvoice(invoice.filter((invoice) => invoice.id !== invoiceId)); // Update state
    alert(`Invoice ${invoiceId} deleted!`);
    navigate('/invoices');

  };

  const handleDeleteFailure = (errorMessage, invoiceId) => {
    console.error(`Error deleting invoice ${invoiceId}:`, errorMessage);
    alert(`Error deleting invoice ${invoiceId}: ${errorMessage}`);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://192.168.1.130:5000/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          invoiceDueDate: invoice.invoiceDueDate,
          clientName: invoice.clientName,
          clientAddress: invoice.clientAddress,
          clientPostcode: invoice.clientPostcode,
          clientEmail: invoice.clientEmail,
          clientPhone: invoice.clientPhone,
          description: invoice.description,
          items: invoice.items,
          grandTotal: invoice.grandTotal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      // Redirect to the invoice list after successful update
      navigate('/invoices');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading invoice...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full p-6 bg-sky-800 rounded-md shadow-md">
      <h2>Edit Invoice</h2>
      <form onSubmit={handleSubmit} className=" border-sky-600 bg-red-100">

        <table className="table px-4 w-full rounded-md border border-gray-200 ">

          <thead className="bg-gray-100 ">
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  value={invoice.invoiceNumber}
                  onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  value={invoice.invoiceDate}
                  onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
          <thead className="bg-gray-100 ">
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  value={invoice.invoiceDueDate}
                  onChange={(e) => handleFieldChange('invoiceDueDate', e.target.value)}
                />
              </td>
              <td>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  type="text"
                  value={invoice.clientName}
                  onChange={(e) => handleFieldChange('clientName', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
          <thead className="bg-gray-100 ">
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  value={invoice.clientPostcode}
                  onChange={(e) => handleFieldChange('clientPostcode', e.target.value)}
                />
              </td>

              <td>
                <input
                  type="text"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  value={invoice.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className=" w-full">
          <table className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden ">
            <thead className="bg-gray-100 ">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Items</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Qty</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Price</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Total</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="border-4 border-blue-600  justify-between items-start mb-8">
          <div className="border-4 border-green-600   bg-white shadow-lg rounded-md">
            <table className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden ">
              <thead className="bg-gray-100 ">
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Items</th>
                  <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Qty</th>
                  <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Price</th>
                  <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="w-20 border p-2"
                        value={item.item}
                        onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="w-20 border p-2"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="w-20 border p-2"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        step="0.01"
                      />
                    </td>
                    <td>{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mb-8">
              <div className="flex justify-end">
                <span className="font-semibold mr-4">Grand Total: £{calculateGrandTotal()}</span>
              </div>
            </div>
            <div>
              <h1>Invoices</h1>
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
        <div ref={reportRef}>
          <div className="container m-auto grid grid-cols-4 grid-rows-5 gap-4 md:grid-cols-4 lg:grid-cols-4" >
            <div className="tile bg-lime-600 lg:col-span-1 lg:col-start-1">
              <h1 className="tile-marker">FOUR</h1>
            </div>
            <div className="tile bg-green-600">
              <h1 className="tile-marker">FIVE</h1>
            </div>
            <div className="tile bg-emerald-500">
              <h1 className="tile-marker">SIX</h1>
            </div>
            <div className="tile bg-teal-500">
              <h1 className="tile-marker">SEVEN</h1>
            </div>
          </div>
          <div className="border-4 border-green-600  bg-gray-50 ">
            <div className="px-5  rounded-md">
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
                  <p className="text-gray-600">Due Date: {invoice.invoiceDueDate} </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-2  flex flex-col ">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Bill To:</h2>
              <p className="text-gray-600">{invoice.clientName}</p>
              <p className="text-gray-600">{invoice.clientAddress}</p>
              <p className="text-gray-600">{invoice.clientPostcode}</p>
              <p className="text-gray-600">{invoice.clientPhone}</p>
            </div>
            <table className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden ">
              <thead className="bg-gray-100 ">
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Items</th>
                  <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Qty</th>
                  <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Price</th>
                  <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Total</th>
                </tr>
              </thead>
            </table>

            {invoice.items.map((item, index) => (
              <div key={{ index }} className="border-4 border-blue-600   grid gap-4  lg:grid-cols-4 lg:grid-rows-2">
                <input
                  type="text"
                  className="w-20 border p-2"
                  value={item.item}
                  onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                />
                <input
                  type="number"
                  className="w-20 border p-2"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                />
                <input
                  type="number"
                  className="w-20 border p-2 "
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  step="0.01"
                />
                <div className="border-4 border-lime-300  ...">
                  {(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={generatePdf}>Generate PDF</button>
          </div>
        </div>
      </form >

    </div >
  );
};







export default EditInvoice;