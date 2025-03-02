import React, { useEffect, useState } from 'react';
import "../App.css";

import { useParams, useNavigate } from 'react-router-dom';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // Fetch invoices from the Flask back-end
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://192.168.1.130:5000');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
        console.log(data)
        navigate('/invoices');

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-md shadow-md">

      <h2>Invoice List</h2>
      <table className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden ">
        <thead className="bg-gray-100 ">
          <tr className="bg-gray-100">

            <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Client Name</th>
            <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Client Post Code</th>
            <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Total</th>
            <th className="py-3 px-4 text-left text-sm  uppercase tracking-wide" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className='py-3 px-4 text-base text-gray-500 font-medium'>{invoice.clientName}</td>
              <td className='py-3 px-4 text-base text-gray-500 font-medium'>{invoice.clientPostcode}</td>
              <td className='py-3 px-4 text-base text-gray-500 font-medium'>${invoice.grandTotal.toFixed(2)}</td>
              <td className='py-3 px-4 text-base text-gray-500 font-medium'>

                <button
                   className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                  onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                >
                  Edit
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default InvoiceList;