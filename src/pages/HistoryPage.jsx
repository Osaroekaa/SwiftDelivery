import { useState, useEffect } from 'react';
import Layout from '../component/Layout';
import './HistoryPage.css';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load delivery history
  }, []);

  return (
    <Layout>
      <div className="history-page">
        <h1>Delivery History</h1>
        {history.length === 0 ? (
          <p>No delivery history yet</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                {item.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
