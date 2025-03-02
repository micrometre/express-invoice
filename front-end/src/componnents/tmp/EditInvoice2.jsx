import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const EditInvoice = () => {
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
        const response = await fetch(`http://localhost:5000/invoices/${invoiceId}`);
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/invoices/${invoiceId}`, {
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
    <div className="mx-auto p-6 bg-sky-100 rounded-md shadow-md">
      <h2>Edit Invoice</h2>
      <form onSubmit={handleSubmit} className="w-full border-sky-600 bg-red-100">

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
        </div>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="mb-4">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

function InvoicePdf() {
  const reportRef = useRef(null);
  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Hello, this is a simple PDF!", 20, 20);
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





export default EditInvoice;