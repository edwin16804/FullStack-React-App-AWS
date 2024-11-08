import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckOrders.css';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';

const CheckOrders = ({ goBack }) => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://gkl03cf29f.execute-api.us-east-1.amazonaws.com/stage1/check-orders');
      console.log("Fetched Orders:", response.data); // Log the response data
      setOrders(response.data);
      setMessage('');
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel an order
  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`https://gkl03cf29f.execute-api.us-east-1.amazonaws.com/stage1/delete-order/${orderId}`);
      console.log("Order Canceled:", response.data); // Log the cancel response

      // Remove the canceled order from the state
      setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
      setMessage('Order canceled successfully');
    } catch (error) {
      console.error(error);
      setMessage('Failed to cancel order');
    }
  };

  return (
    <div className="check-orders">
      <div className="header">
        <button onClick={goBack} className="back-btn">Back</button>
        <h1>All Orders</h1>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button 
          onClick={fetchOrders}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? 'grey' : 'white',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Error or Success Message */}
      {message && (
        <p style={{ color: message.includes('Failed') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>
      )}

      {/* Orders Table */}
      <div className="orders-table">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading orders...</p>
        ) : orders.length > 0 ? (
          <table style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Shoe</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderId}</td>
                  <td>{order.name}</td> 
                  <td>{order.phoneNumber}</td>
                  <td>{order.shoe}</td>
                  <td>{order.quantity}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    <button
                      onClick={() => cancelOrder(order.orderId)} // Call cancelOrder function with orderId
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '5px'
                      }}
                    >
                      <CancelIcon />
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <AutoFixNormalIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center' }}>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default CheckOrders;
