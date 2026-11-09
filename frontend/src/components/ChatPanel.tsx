import { useEffect, useRef } from 'react';
import { Bot, CheckCircle2, RotateCcw, ShoppingBag } from 'lucide-react';

export type ChatMessage = { id: number; author: 'bot' | 'customer'; text: string; status?: string };

type Props = {
  messages: ChatMessage[];
  onCheck: () => void;
  onRestart: () => void;
  busy: boolean;
};

export function ChatPanel({ messages, onCheck, onRestart, busy }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  return (
    <section className="conversation card" aria-label="Simulated customer conversation">
      <div className="conversation-header">
        <div className="avatar"><ShoppingBag size={20} /></div>
        <div>
          <div className="conversation-heading">ShopNow Support <span className="online-dot" /></div>
          <div className="conversation-subtitle">Automated order assistant · Demo channel</div>
        </div>
        <span className="chat-header-tag">SIMULATED</span>
      </div>
      <div className="conversation-body" aria-live="polite" aria-relevant="additions">
        <div className="day-divider"><span>Today</span></div>
        {messages.map((message) => (
          <div key={message.id} className={`message-line ${message.author === 'customer' ? 'mine' : ''}`}>
            {message.author === 'bot' && <div className="bubble-avatar"><Bot size={17} /></div>}
            <div className={`bubble ${message.author}`}>
              {message.status && <div className="bubble-status"><CheckCircle2 size={16}/>{message.status}</div>}
              <span>{message.text}</span>
            </div>
          </div>
        ))}
        {busy && <div className="message-line"><div className="bubble-avatar"><Bot size={17}/></div><div className="bubble bot typing">Checking your order<span className="dots">...</span></div></div>}
        <div ref={bottomRef} />
      </div>
      <div className="conversation-actions">
        <button type="button" className="btn btn-primary" onClick={onCheck} disabled={busy}><ShoppingBag size={17}/> Check order</button>
        <button type="button" className="btn btn-light" onClick={onRestart} disabled={busy}><RotateCcw size={17}/> Restart</button>
      </div>
    </section>
  );
}