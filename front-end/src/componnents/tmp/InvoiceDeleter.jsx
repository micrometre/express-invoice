import React, { useState } from 'react';

function InvoiceDeleter({ invoiceId, onDeleteSuccess, onDeleteFailure }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState(null);

  const handleDelete = async (e) => {
    setIsDeleting(true);
    setError(null);
    e.preventDefault();


    try {
      const response = await fetch(`http://192.168.1.130:5000/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        onDeleteSuccess && onDeleteSuccess(data.message, invoiceId); // Pass a success message and invoiceId
      } else {
        // Handle different error scenarios gracefully
        if (response.status === 404) {
          setError("Invoice not found.");  //Specific error message
          onDeleteFailure && onDeleteFailure("Invoice not found.", invoiceId); //More detailed information
        } else {
          const errorData = await response.json();  //Try to get error details from the server.
          setError(errorData.description || `Error deleting invoice: ${response.status}`);
          onDeleteFailure && onDeleteFailure(errorData.description || `Error deleting invoice: ${response.status}`, invoiceId); //Pass more detailed info.
        }
      }
    } catch (error) {
      setError(`Network or other error: ${error.message}`);
      onDeleteFailure && onDeleteFailure(`Network or other error: ${error.message}`, invoiceId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={isDeleting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> 
        {isDeleting ? 'Deleting...' : 'Delete Invoice'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default InvoiceDeleter;