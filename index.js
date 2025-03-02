const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const DATABASE = 'invoices.db';

// Initialize the database
const initDb = () => {
  const db = new sqlite3.Database(DATABASE, (err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
      db.run(`
        CREATE TABLE IF NOT EXISTS invoices (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          invoice_number TEXT NOT NULL,
          invoice_date TEXT NOT NULL,
          invoice_due_date TEXT NOT NULL,
          client_name TEXT NOT NULL,
          client_address TEXT NOT NULL,
          client_postcode TEXT NOT NULL,
          client_email TEXT NOT NULL,
          client_phone TEXT NOT NULL,
          description TEXT NOT NULL,
          items TEXT NOT NULL,
          grand_total REAL NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Invoices table created or already exists.');
        }
      });
    }
  });
};

// Initialize the database
initDb();

// Helper function to get a database connection
const getDb = () => {
  return new sqlite3.Database(DATABASE, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    }
  });
};

// Save an invoice
app.post('/', (req, res) => {
  const data = req.body;
  const itemsJson = JSON.stringify(data.invoiceItems);
  const {
    invoiceDate,
    fromDate,
    clientName,
    clientAddress,
    clientPostcode,
    clientEmail,
    clientPhone,
    description,
    invoiceNumber,
    grandTotal,
  } = data;

  const db = getDb();
  db.run(
    `
    INSERT INTO invoices (
      invoice_number, invoice_date, invoice_due_date, client_name, client_address,
      client_postcode, client_email, client_phone, description, items, grand_total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      invoiceNumber,
      invoiceDate,
      fromDate,
      clientName,
      clientAddress,
      clientPostcode,
      clientEmail,
      clientPhone,
      description,
      itemsJson,
      grandTotal,
    ],
    function (err) {
      if (err) {
        console.error('Error saving invoice:', err.message);
        res.status(500).json({ error: 'Failed to save invoice' });
      } else {
        res.status(201).json({
          id: this.lastID,
          items: grandTotal,
          grandTotal: grandTotal,
        });
      }
    }
  );
  db.close();
});

// Get all invoices
app.get('/', (req, res) => {
  const db = getDb();
  //db.all('SELECT * FROM invoices ORDER BY invoice_number DESC', (err, rows) => {
    db.all('SELECT * FROM invoices ORDER BY id DESC LIMIT 10', (err, rows) => {

    if (err) {
      console.error('Error fetching invoices:', err.message);
      res.status(500).json({ error: 'Failed to fetch invoices' });
    } else {
      const result = rows.map((row) => ({
        id: row.id,
        items: JSON.parse(row.items),
        invoiceNumber: row.invoice_number,
        invoiceDate: row.invoice_date,
        invoiceDueDate: row.invoice_due_date,
        clientName: row.client_name,
        clientAddress: row.client_address,
        clientPostcode: row.client_postcode,
        clientEmail: row.client_email,
        clientPhone: row.client_phone,
        description: row.description,
        grandTotal: row.grand_total,
      }));
      res.json(result);
    }
  });
  db.close();
});

// Update an invoice by ID
app.put('/invoices/:invoiceId', (req, res) => {
  const invoiceId = req.params.invoiceId;
  const data = req.body;
  const itemsJson = JSON.stringify(data.items);
  const {
    invoiceNumber,
    invoiceDate,
    invoiceDueDate,
    clientName,
    grandTotal,
  } = data;

  const db = getDb();
  db.run(
    `
    UPDATE invoices
    SET invoice_number = ?, invoice_date = ?, invoice_due_date = ?, client_name = ?, items = ?, grand_total = ?
    WHERE id = ?
  `,
    [invoiceNumber, invoiceDate, invoiceDueDate, clientName, itemsJson, grandTotal, invoiceId],
    function (err) {
      if (err) {
        console.error('Error updating invoice:', err.message);
        res.status(500).json({ error: 'Failed to update invoice' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Invoice not found' });
      } else {
        res.json({
          id: invoiceId,
          invoiceNumber: invoiceNumber,
          invoiceDate: invoiceDate,
          invoiceDueDate: invoiceDueDate,
          clientName: clientName,
          items: data.items,
          grandTotal: grandTotal,
        });
      }
    }
  );
  db.close();
});

// Fetch a specific invoice by ID
app.get('/invoices/:invoiceId', (req, res) => {
  const invoiceId = req.params.invoiceId;
  const db = getDb();
  db.get('SELECT * FROM invoices WHERE id = ?', [invoiceId], (err, row) => {
    if (err) {
      console.error('Error fetching invoice:', err.message);
      res.status(500).json({ error: 'Failed to fetch invoice' });
    } else if (!row) {
      res.status(404).json({ error: 'Invoice not found' });
    } else {
      res.json({
        id: row.id,
        invoiceNumber: row.invoice_number,
        invoiceDate: row.invoice_date,
        invoiceDueDate: row.invoice_due_date,
        clientName: row.client_name,
        clientAddress: row.client_address,
        clientPostcode: row.client_postcode,
        clientEmail: row.client_email,
        clientPhone: row.client_phone,
        description: row.description,
        items: JSON.parse(row.items),
        grandTotal: row.grand_total,
      });
    }
  });
  db.close();
});

// Delete an invoice by ID
app.delete('/invoices/:invoiceId', (req, res) => {
  const invoiceId = req.params.invoiceId;
  const db = getDb();
  db.run('DELETE FROM invoices WHERE id = ?', [invoiceId], function (err) {
    if (err) {
      console.error('Error deleting invoice:', err.message);
      res.status(500).json({ error: 'Failed to delete invoice' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Invoice not found' });
    } else {
      res.json({ message: 'Invoice deleted successfully' });
    }
  });
  db.close();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});