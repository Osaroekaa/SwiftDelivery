import { useState } from 'react';
import Layout from '../component/Layout';
import './DropoffPage.css';

export default function DropoffPage() {
  const [location, setLocation] = useState('');

  return (
    <Layout>
      <div className="dropoff-page">
        <h1>Select Dropoff Location</h1>
        <input
          type="text"
          placeholder="Enter dropoff location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </Layout>
  );
}
