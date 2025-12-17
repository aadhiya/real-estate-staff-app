// src/App.tsx
import React, { useState } from 'react';
import PropertyForm from './components/PropertyForm';
import PropertyList from './components/PropertyList';
import { themeColors } from './theme';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  return (
    <div className="app-container">
      <div className="header">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          🏠 Real Estate Staff Portal
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Manage Properties Efficiently
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          className="btn-primary"
          style={{
            flex: 1,
            background: activeTab === 'add' ? 'linear-gradient(45deg, var(--orange), var(--orange-dark))' : '#e0e0e0',
            color: activeTab === 'add' ? 'white' : 'var(--dark-gray)'
          }}
          onClick={() => setActiveTab('add')}
        >
          ➕ Add New Property
        </button>
        <button
          className="btn-primary"
          style={{
            flex: 1,
            background: activeTab === 'list' ? 'linear-gradient(45deg, var(--blue), var(--blue-dark))' : '#e0e0e0',
            color: activeTab === 'list' ? 'white' : 'var(--dark-gray)'
          }}
          onClick={() => setActiveTab('list')}
        >
          🔍 View & Search Properties
        </button>
      </div>

      <div className="card">
        {activeTab === 'add' && <PropertyForm />}
        {activeTab === 'list' && <PropertyList />}
      </div>
    </div>
  );
};

export default App;
