import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import EditInvoiceForm from './EditInvoiceForm';
import InvoicePdf from './InvoicePdf';

const EditInvoice = () => {
  const reportRef = useRef(null);
  const { invoiceId } = useParams();
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
      y: 10,
      width: 170,
      windowWidth: 650
    });
  };

  const handleFieldChange = (field, value) => {
    setInvoice({ ...invoice, [field]: value });
  };

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
    console.log(message);
    alert(`Invoice ${invoiceId} deleted!`);
    navigate('/invoices');
  };

  const handleDeleteFailure = (errorMessage, invoiceId) => {
    console.error(`Error deleting invoice ${invoiceId}:`, errorMessage);
    alert(`Error deleting invoice ${invoiceId}: ${errorMessage}`);
  };

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
    <div className="w-full p-6 bg-sky-100 rounded-md shadow-md">
      <h2>Edit Invoice</h2>
      <EditInvoiceForm
        invoice={invoice}
        handleFieldChange={handleFieldChange}
        handleItemChange={handleItemChange}
        handleSubmit={handleSubmit}
        calculateGrandTotal={calculateGrandTotal}
        handleDeleteSuccess={handleDeleteSuccess}
        handleDeleteFailure={handleDeleteFailure}
      />
      <InvoicePdf
        invoice={invoice}
        reportRef={reportRef}
        generatePdf={generatePdf}
      />
    </div>
  );
};

export default EditInvoice;