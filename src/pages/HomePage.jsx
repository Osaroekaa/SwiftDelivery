import { useState } from 'react';
import Layout from '../component/Layout';
import './HomePage.css';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <Layout>
      <div className="home-page">
        <div className="home-header">
          <h1>Welcome Home</h1>
        </div>
        <div className="home-content">
          <p>Your delivery dashboard</p>
        </div>
      </div>
    </Layout>
  );
}
