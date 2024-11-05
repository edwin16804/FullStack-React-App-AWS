// App.js
import React, { useState, useEffect } from 'react';
import BuyShoes from './components/BuyShoes';
import CheckOrders from './components/CheckOrders';
import './App.css'; // Link the CSS file
import axios from "axios";


const App = () => {
  const [view, setView] = useState(null);

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  return (
    <div className="app">
      {!view && (
        <div id="start">
          <center>
            <h1>SNEAKER STORE</h1>
            <button className="see-btn" onClick={() => handleViewChange('buy')}>See Collection</button>
            <button className="check-btn" onClick={() => handleViewChange('orders')}>Check Orders</button>
          </center>
        </div>
      )}
      {view === 'buy' && <BuyShoes goBack={() => setView(null)} />}
      {view === 'orders' && <CheckOrders goBack={() => setView(null)} />}
    </div>
  );
};

export default App;

