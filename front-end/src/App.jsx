import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoiceList from './componnents/InvoiceList';
import EditInvoice from './componnents/EditInvoice';
import Layout from './componnents/Layout';
import InvoiceCreate from './componnents/InvoiceCreate';
function App() {
  return (
    <Router>
      <Routes>
        <Route  element={<Layout />}>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/create" element={<InvoiceCreate />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoices/:invoiceId/edit" element={<EditInvoice />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;