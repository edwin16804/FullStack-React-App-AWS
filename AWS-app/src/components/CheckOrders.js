// CheckOrders.js
import React, { useState } from 'react';
import './CheckOrders.css';

const CheckOrders = ({ goBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState([]); // This will store the orders once fetched

  const handleCheckOrders = (event) => {
    event.preventDefault();
    // Logic to fetch orders based on phone number
    // setOrders(fetchedOrders);
  };

  return (
    <div className="check-orders">
      <div className="header">
        <button onClick={goBack} className="back-btn">Back</button>
        <h1>Orders</h1>
      </div>
      <center>
        <form onSubmit={handleCheckOrders}>
          <label>
            Enter Phone No.
            <input 
              type="text" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              required 
            />
          </label>
          <center>
            <input type="submit" value="Check Orders" />
          </center>
        </form>
      </center>
      <div className="orders-table">
        {orders.length > 0 && (
          <table style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Shoe</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Cancel Order</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderId}</td>
                  <td>{order.shoe}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalPrice}</td>
                  <td><button>Cancel Order</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CheckOrders;