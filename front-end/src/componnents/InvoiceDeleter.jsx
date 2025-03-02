import React from 'react';

const InvoiceDeleter = ({ invoiceId, onDeleteSuccess, onDeleteFailure }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://192.168.1.130:5000/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }

      onDeleteSuccess('Invoice deleted successfully', invoiceId);
    } catch (error) {
      onDeleteFailure(error.message, invoiceId);
    }
  };

  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={handleDelete}
    >
      Delete Invoice
    </button>
  );
};

export default InvoiceDeleter;