import { FormEvent } from 'react';
import { ArrowUpRight, Info, Search, ShieldCheck } from 'lucide-react';
import { testOrders } from '../data/demoOrders';

type Props = {
  orderId: string;
  digits: string;
  onOrderIdChange: (value: string) => void;
  onDigitsChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onExample: (id: string, digits: string) => void;
  loading: boolean;
};

export function OrderLookupPanel({ orderId, digits, onOrderIdChange, onDigitsChange, onSubmit, onExample, loading }: Props) {
  return (
    <aside className="side-column">
      <section className="card lookup-card">
        <div className="section-heading"><div className="section-icon"><Search size={19}/></div><div><h2>Order lookup</h2><p>Use the sample orders to test the flow.</p></div></div>
        <form onSubmit={onSubmit} className="lookup-form">
          <label htmlFor="orderId">Order number</label>
          <input id="orderId" name="orderId" autoComplete="off" spellCheck="false" maxLength={8} value={orderId} onChange={(e) => onOrderIdChange(e.target.value.toUpperCase())} placeholder="SN-12345" required />
          <label htmlFor="digits">Phone verification (demo only)</label>
          <input id="digits" name="digits" type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={digits} onChange={(e) => onDigitsChange(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="4 digits" required />
          <button type="submit" className="btn btn-primary submit-btn" disabled={loading}><Search size={17}/>{loading ? 'Checking order...' : 'Check status'}<ArrowUpRight size={16}/></button>
        </form>
      </section>
      <section className="card examples-card">
        <div className="section-heading"><div className="section-icon"><Info size={18}/></div><div><h2>Test scenarios</h2><p>Click a scenario to fill the form.</p></div></div>
        <div className="order-list">
          {testOrders.map((order) => <button type="button" key={order.id} onClick={() => onExample(order.id, order.digits)} className="order-option">
            <span><strong>{order.id}</strong><small>Code: {order.digits}</small></span>
            <span className={`status-chip ${order.kind === 'outage' ? 'danger' : ''}`}>{order.label}</span>
          </button>)}
        </div>
      </section>
      <div className="security-note"><ShieldCheck size={19}/><p><strong>Demo security note.</strong> The four-digit check is fictional and is not real customer authentication. Production requires verified customer identity, order-level authorization, rate limiting and audit logs.</p></div>
    </aside>
  );
}