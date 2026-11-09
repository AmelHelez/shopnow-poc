import { FormEvent, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Code2, LockKeyhole, MessageCircleMore, Sparkles } from 'lucide-react';
import { ChatMessage, ChatPanel } from './components/ChatPanel';
import { OrderLookupPanel } from './components/OrderLookupPanel';
import { lookupOrder, OrderLookupError } from './services/orderApi';
import './styles.css';

const welcome: ChatMessage = { id: 1, author: 'bot', text: 'Hi there! Welcome to ShopNow. I can help you find out where your order is. Select “Check order” or choose one of the sample orders to begin.' };

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [orderId, setOrderId] = useState('SN-12345');
  const [digits, setDigits] = useState('4821');
  const [loading, setLoading] = useState(false);
  const sequence = useRef(2);
  const add = (author: 'bot' | 'customer', text: string, status?: string) => {
    setMessages((current) => [...current, { id: sequence.current++, author, text, status }]);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const id = orderId.trim().toUpperCase();
    add('customer', `Please check order ${id}`);
    setLoading(true);

    try
    {
      const response = await lookupOrder(id, digits.trim());
      const delivery = response.estimatedDelivery ? `\nEstimated delivery: ${new Date(`${response.estimatedDelivery}T12:00:00`).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'})}` : '';
      add('bot', `Order: ${response.orderId}\n${response.message}${delivery}\n\nIs there anything else I can help you with?`, response.status);
    }
    catch (err)
    {
      if (err instanceof OrderLookupError && err.statusCode === 503) {
        add('bot', 'I’m sorry, the order system is temporarily unavailable. Please try again later or contact ShopNow support.');
      }
      else if (err instanceof OrderLookupError && err.statusCode === 404) {
        add('bot', 'I couldn’t verify this order with the details provided. Please check the order number and demo digits, or contact support.');
      }
      else if (err instanceof OrderLookupError && err.statusCode === 400) {
        add('bot', 'Please enter an order number like SN-12345 and exactly four verification digits.');
      }
      else {
        add('bot', 'The demo API cannot be reached. Please check that the backend is running.');
      }
    }
    finally { setLoading(false); }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="ShopNow home">
          <span className="brand-mark">S<span>.</span></span><span>shopnow<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="topbar-tag">Proof of Concept</span>
        </div>
      </header>
      <main className="main-content">
        <section className="hero">
          <div className="hero-eyebrow"><Sparkles size={15}/> SMARTER ORDER SUPPORT</div>
          <div className="hero-content">
            <div>
              <h1>Support that keeps<br/><span>customers moving.</span></h1>
              <p>Explore a simulated conversational order-status experience built for the ShopNow pre-sales assessment.</p>
            </div>
            <div className="hero-meta">
              <div><strong>01</strong><span>Order status<br/>self-service</span></div>
              <div><strong>02</strong><span>Mock OMS<br/>integration</span></div>
              <div><strong>03</strong><span>Error handling<br/>&amp; fallback</span></div>
            </div>
          </div>
        </section>
        <div className="simulation-label">
          <div><MessageCircleMore size={18}/><strong>Live demo</strong><span>Try the sample order lookup</span></div>
          <div className="label-badge"><span/> Simulation only - not connected to Infobip</div>
        </div>
        <div className="workspace">
          <ChatPanel
             messages={messages}
             busy={loading}
             onCheck={() => { add('customer', 'Check order status'); add('bot', 'Please enter your order number and demo verification digits in the form on the right.'); document.getElementById('orderId')?.focus(); }}
             onRestart={() => { sequence.current = 2; setMessages([welcome]); }} 
          />
          <OrderLookupPanel
            orderId={orderId}
            digits={digits}
            onOrderIdChange={setOrderId}
            onDigitsChange={setDigits}
            onSubmit={submit}
            onExample={(id, code) => { setOrderId(id); setDigits(code); }}
            loading={loading}/>
         </div>
        <section className="architecture">
          <div className="architecture-title">
            <div className="arch-icon">
              <Code2 size={19}/>
            </div>
            <div>
              <h2>How the concept works</h2>
              <p>The customer-facing conversation is simulated. Business data comes from a real local .NET mock endpoint.</p>
            </div>
          </div>
          <div className="arch-flow">
            <div>
              <MessageCircleMore size={20}/><strong>Messaging channel</strong><span>WhatsApp / Viber (simulated)</span>
            </div>
            <ArrowRight className="arch-arrow" size={18}/>
            <div>
              <Sparkles size={20}/><strong>Chatbot logic</strong><span>React UI simulation</span>
            </div>
            <ArrowRight className="arch-arrow" size={18}/>
            <div>
              <LockKeyhole size={20}/><strong>Integration API</strong><span>ASP.NET Core mock OMS</span>
            </div>
            <ArrowRight className="arch-arrow" size={18}/>
            <div>
              <CheckCircle2 size={20}/><strong>Verified response</strong><span>Fictional order status</span>
            </div>
          </div>
          <p className="arch-disclaimer">Production design: Infobip Automation Studio - Chatbots would handle conversations; ShopNow would authenticate customers and authorize access to each order. Messages API would handle outbound multi-channel notifications.</p>
        </section>
      </main>
      <footer className="footer">
        <span>ShopNow · Technical recruitment demonstration</span><span>Fictional data · Not affiliated with a real retailer or connected to Infobip</span>
      </footer>
    </div>
  );
}