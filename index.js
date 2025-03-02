const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE = 'invoices.db';

app.use(cors());
app.use(bodyParser.json());

// Initialize the database
function initDb() {
    const db = new sqlite3.Database(DATABASE, (err) => {
        if (err) {
            console.error(err.message);
            throw err;
        } else {
          console.log('Connected to the database.');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_number TEXT,
            invoice_date TEXT,
            invoice_due_date TEXT,
            client_name TEXT,
            client_address TEXT,
            client_postcode TEXT,
            client_email TEXT,
            client_phone TEXT,
            description TEXT,
            items TEXT NOT NULL,
            grand_total REAL NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Table initialized.');
        }
        db.close();
    });
}

// Helper function to get a database connection
function getDb() {
    return new sqlite3.Database(DATABASE, (err) => {
        if (err) {
            console.error(err.message);
            throw err;
        }
    });
}

// Save an invoice
app.post('/', (req, res) => {
    const data = req.body;
    const itemsJson = JSON.stringify(data.invoiceItems);
    const invoice_date = data.invoiceDate;
    const invoice_due_date = data.fromDate;
    const client_name = data.clientName;
    const client_address = data.clientAddress;
    const client_postcode = data.clientPostcode;
    const client_email = data.clientEmail;
    const client_phone = data.clientPhone;
    const description = data.description;
    const invoice_number = data.invoiceNumber;
    const grand_total = parseFloat(data.grandTotal);
    console.log(data);

    const db = getDb();
    db.run(`
        INSERT INTO invoices (invoice_number, invoice_date, invoice_due_date, client_name, client_address, client_postcode, client_email, client_phone, description, items, grand_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [invoice_number, invoice_date, invoice_due_date, client_name, client_address, client_postcode, client_email, client_phone, description, itemsJson, grand_total], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            db.close();
            return;
        }

        const invoiceId = this.lastID;
        res.status(201).json({
            id: invoiceId,
            items: grand_total,
            grandTotal: grand_total
        });
        db.close();
    });
});

// Get all invoices
app.get('/', (req, res) => {
    const db = getDb();
    db.all('SELECT * FROM invoices ORDER BY invoice_number DESC', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            db.close();
            return;
        }

        const result = rows.map(row => ({
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
            grandTotal: row.grand_total
        }));

        res.json(result);
        db.close();
    });
});

// Update an invoice
app.put('/invoices/:invoice_id', (req, res) => {
    const invoiceId = req.params.invoice_id;
    const data = req.body;
    console.log(data);
    if (!data) {
        res.status(400).json({ error: "Invalid invoice data" });
        return;
    }

    const itemsJson = JSON.stringify(data.items);
    const grand_total = parseFloat(data.grandTotal);
    const invoice_number = data.invoiceNumber;
    const invoice_date = data.invoiceDate;
    const invoice_due_date = data.invoiceDueDate;
    const client_name = data.clientName;

    const db = getDb();
    db.run(`
        UPDATE invoices
        SET invoice_number = ?, invoice_date = ?, invoice_due_date = ?, client_name = ?, items = ?, grand_total = ?
        WHERE id = ?
    `, [invoice_number, invoice_date, invoice_due_date, client_name, itemsJson, grand_total, invoiceId], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            db.close();
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: "Invoice not found" });
        } else {
            res.json({
                id: invoiceId,
                invoice_number: invoice_number,
                invoice_date: invoice_date,
                invoice_due_date: invoice_due_date,
                client_name: client_name,
                items: data.items,
                grandTotal: grand_total,
            });
        }
        db.close();
    });
});

// Get a single invoice by ID
app.get('/invoices/:invoice_id', (req, res) => {
    const invoiceId = req.params.invoice_id;
    const db = getDb();
    db.get('SELECT * FROM invoices WHERE id = ?', [invoiceId], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            db.close();
            return;
        }

        if (!row) {
            res.status(404).json({ error: "Invoice not found" });
        } else {
            res.json({
                id: row.id,
                invoiceNumber: row.invoice_number,
                invoiceDate: row.invoice_date,
                invoiceDueDate: row.invoice_due_date,
                clientName: row.client_name,
                client_address: row.client_address,
                clientPostcode: row.client_postcode,
                clientEmail: row.client_email,
                clientPhone: row.client_phone,
                description: row.description,
                items: JSON.parse(row.items),
                grandTotal: row.grand_total
            });
        }
        db.close();
    });
});

// Delete an invoice
app.delete('/invoices/:invoice_id', (req, res) => {
    const invoiceId = req.params.invoice_id;
    const db = getDb();
    db.run('DELETE FROM invoices WHERE id = ?', [invoiceId], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
            db.close();
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: "Invoice not found" });
        } else {
            res.json({ message: 'Invoice deleted successfully' });
        }
        db.close();
    });
});

app.get('/a', (req, res) => {
  res.send("endpoint a");
})
app.post('/a', (req, res) => {
    const requestData = req.body;
    res.json(requestData);
});

// Initialize database
initDb();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
