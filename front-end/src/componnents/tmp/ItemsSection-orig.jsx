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
      <td>
        <input 
          type="text" 
          className="form-control" 
          name="item" 
          value={item} 
          onChange={handleInputChange} 
          placeholder="Item" 
        />
      </td>
      <td>
        <input 
          type="number" 
          className="form-control" 
          name="quantity" 
          value={quantity} 
          onChange={handleInputChange} 
          min="1" 
        />
      </td>
      <td>
        <input 
          type="number" 
          className="form-control" 
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

const InvoiceForm = () => {
  const [invoiceItems, setInvoiceItems] = useState([]);

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
    <div>
      <h2>Invoice</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Actions</th>
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
      <button className="btn btn-primary" onClick={handleAddItem}>
        Add Item
      </button>
    </div>
  );
};

export default InvoiceForm;