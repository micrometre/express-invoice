import React, { useState } from 'react';




const InvoiceItem = ({ index, onRemoveItem }) => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'item') setItem(value);
    if (name === 'quantity') setQuantity(value);
    if (name === 'price') setPrice(value);
  };

  return (
    <tr>
      <td className='py-3 px-4 text-base text-gray-500 font-medium'>
        <input
          type="text"
          className="w-40 border p-2"
          name="item"
          value={item}
          onChange={handleInputChange}
          placeholder="Item"
        />
      </td>
      <td className='py-3 px-4 text-base text-gray-500 font-medium'>
        <input
          type="number"
          className="w-20 border p-2"
          name="quantity"
          value={quantity}
          onChange={handleInputChange}
          min="1"
        />
      </td>
      <td className='py-3 px-4 text-base text-gray-500 font-medium'>
        <input
          type="number"
          className="w-20 border p-2"
          name="price"
          value={price}
          onChange={handleInputChange}
          step="0.01"
        />
      </td>
      <td className='py-3 px-4 text-base text-gray-500 font-medium'>
        {(quantity * price).toFixed(2)}
      </td>
      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onRemoveItem(index)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};


function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}


function convertToDateString(date) {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}


const ItemsSection = () => {
  const [currentDate, setCurrentDate] = useState(getDate());
  const [currentDateTime, setCurrentDateTime] = useState(convertToDateString());
  const [invoiceItems, setInvoiceItems] = useState([]);

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionStatus('pending'); // Indicate submission is in progress
    setErrors({}); // Clear previous errors
    try {
      const response = await fetch('http://192.168.1.130:5000/', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentDate }),
      });
      if (!response.ok) {
        const message = `An error occurred: ${response.status}`;
        throw new Error(message);
      }
      const responseData = await response.json(); // Or response.text() if server doesn't return JSON
      console.log('Server response:', responseData);
      setSubmissionStatus('success');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      setErrors({ submit: 'Failed to submit form. Please try again later.' }); // Generic submit error
    }
  };


  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { item: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => {
      return total + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="mx-auto ">
      <form className="w-full border-sky-600 bg-red-100">
        <div className="bg-white"> {/* Container */}
          <div className=" w-full">
            <table className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden ">
              <thead className="bg-gray-100 ">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Items</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Qty</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Price</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Total</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, index) => (
                  <InvoiceItem
                    key={index}
                    index={index}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
                <tr>
                  <td colSpan="3" className="text-right">
                    <strong>Total:</strong>
                  </td>
                  <td>${calculateTotal()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={submissionStatus === 'pending'} // Disable button during submission
          >
            {submissionStatus === 'pending' ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
        <div className="flex items-center justify-between">
          <button className="btn btn-primary" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
    </div>
  );
};






export default ItemsSection;