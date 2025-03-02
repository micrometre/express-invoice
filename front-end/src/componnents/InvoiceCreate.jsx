import React, { useState } from 'react';
import { convertToDateString, getDate } from './convertToDateString';
import { useParams, useNavigate } from 'react-router-dom';

const InvoiceItem = ({ index, onRemoveItem, value, onChange }) => {
  const { item, quantity, price } = value;


  const handleInputChange = (event) => {
    const { name, value: inputValue } = event.target;
    onChange(index, { ...value, [name]: inputValue });
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          className="w-25 border "
          name="item"
          value={item}
          onChange={handleInputChange}
          placeholder="Item"
        />
      </td>
      <td>
        <input
          type="number"
          className="w-20 border p-2"
          name="quantity"
          value={quantity}
          onChange={handleInputChange}
          min="1"
        />
      </td>
      <td>
        <input
          type="number"
          className="w-20 border "
          name="price"
          value={price}
          onChange={handleInputChange}
          step="0.01"
        />
      </td>
      <td>
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

const InvoiceCreate = () => {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoiceNumber, setInvoIceNumber] = useState(convertToDateString());
  const [invoiceDate, setInvoiceDate] = useState(getDate());
  const [fromDate, setFromDate] = useState(new Date());
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPostcode, setClientPostcode] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const navigate = useNavigate();


  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { item: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, updatedItem) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = updatedItem;
    setInvoiceItems(updatedItems);
  };

  const calculateGrandTotal = () => {
    return invoiceItems.reduce((total, item) => {
      return total + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
    }, 0).toFixed(2);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionStatus('pending'); // Indicate submission is in progress
    try {
      const response = await fetch('http://192.168.1.130:5000', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceNumber,
          invoiceDate,
          fromDate,
          clientName,
          clientAddress,
          clientPostcode,
          clientEmail,
          clientPhone,
          description,
          invoiceItems,
          grandTotal: calculateGrandTotal()

        }),
      });
      if (!response.ok) {
        const message = `An error occurred: ${response.status}`;
        throw new Error(message);
      }
      const responseData = await response.json(); // Or response.text() if server doesn't return JSON
      console.log('Server response:', responseData);
      //window.location.reload();

      setSubmissionStatus('success');
      setInvoIceNumber('');
      setInvoiceDate('');
      setInvoiceDate('');
      setClientName('');
      setClientAddress('');
      setClientPostcode('');
      setClientPhone('');
      setClientEmail('');
      setDescription('');

      navigate('/invoices');


    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      setErrors({ submit: 'Failed to submit form. Please try again later.' }); // Generic submit error
    }
  };




  // Log the invoiceItems whenever it changes
  console.log("Invoice Items:", invoiceItems);

  return (
    <div>
      <h2>Invoice</h2>
      <div className=" mx-auto p-6 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Create Invoice</h2>
        <form onSubmit={handleSubmit} className="w-full border-sky-600 bg-red-100">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="mb-4">
              <label htmlFor="invoice_number" className="block text-gray-700 font-bold mb-2">Invoice number</label>
              <input
                type="text"
                id="invoice_number"
                value={invoiceNumber}
                onChange={(e) => setInvoIceNumber(e.target.invoiceNumber)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="invoice_date" className="block text-gray-700 font-bold mb-2">Invoice date</label>
              <input
                type="text"
                id="invoice_date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.invoiceDate)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="mb-4">
              <label htmlFor="fromDate" className="block text-gray-700 font-bold mb-2">Due date</label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                id="fromDate"
                name="fromDate"
                type="date"
                autoComplete="off"

                onChange={(e) => {
                  setFromDate(e.target.value);
                  console.log(e.target.value)
                }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="client_name" className="block text-gray-700 font-bold mb-2">Client name</label>
              <input
                type="text"
                id="client_name"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="mb-4">
              <label htmlFor="client_address" className="block text-gray-700 font-bold mb-2">Client address</label>
              <input
                type="text"
                id="client_address"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="client_postcode" className="block text-gray-700 font-bold mb-2">Client Postcode</label>
              <input
                type="text"
                id="client_postcode"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                value={clientPostcode}
                onChange={(e) => setClientPostcode(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="mb-4">
              <label htmlFor="client_email" className="block text-gray-700 font-bold mb-2">Client email</label>
              <input
                type="email"
                id="client_email"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="client_phone" className="block text-gray-700 font-bold mb-2">Client phone</label>
              <input
                type="phone"
                id="client_phone"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
              <textarea
                id="description"
                rows="1"
                className={`shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>



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
                      value={item}
                      onRemoveItem={handleRemoveItem}
                      onChange={handleItemChange}
                    />
                  ))}
                </tbody>
              </table>

            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={submissionStatus === 'pending'} // Disable button during submission
                >
                  {submissionStatus === 'pending' ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="text-right mb-8">
          <div className="flex justify-end">
            <span className="font-semibold mr-4">Grand Total: £{calculateGrandTotal()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddItem}>
            Add Item
          </button>
        </div>
      </div>
    </div>

  );
};

export default InvoiceCreate;