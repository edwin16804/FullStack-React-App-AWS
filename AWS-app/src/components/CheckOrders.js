import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckOrders.css';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';

const CheckOrders = ({ goBack }) => {
  const [orders, setOrders] = useState([]);
  const [editOrderId, setEditOrderId] = useState(null); // Track which order is being edited
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://gkl03cf29f.execute-api.us-east-1.amazonaws.com/stage1/check-orders');
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

  const cancelOrder = async (orderId) => {
    try {
      await axios.delete(`https://gkl03cf29f.execute-api.us-east-1.amazonaws.com/stage1/delete-order/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));
      setMessage('Order canceled successfully');
    } catch (error) {
      console.error(error);
      setMessage('Failed to cancel order');
    }
  };

  const modifyOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `https://gkl03cf29f.execute-api.us-east-1.amazonaws.com/stage1/modify-order/${orderId}`,
        editData
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, ...editData } : order
        )
      );
      setMessage('Order updated successfully');
      setEditOrderId(null); // Close edit form
    } catch (error) {
      console.error(error);
      setMessage('Failed to update order');
    }
  };

  return (
    <div className="check-orders">
      <div className="header">
        <button onClick={goBack} className="back-btn">Back</button>
        <h1>All Orders</h1>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button onClick={fetchOrders} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Orders'}
        </button>
      </div>

      {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}

      <div className="orders-table">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
          <table>
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
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{editOrderId === order.orderId ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : (
                    order.name
                  )}</td>
                  <td>{editOrderId === order.orderId ? (
                    <input
                      type="text"
                      value={editData.phoneNumber || ''}
                      onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                    />
                  ) : (
                    order.phoneNumber
                  )}</td>
                  <td>{order.shoe}</td>
                  <td>{order.quantity}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {editOrderId === order.orderId ? (
                      <>
                        <button onClick={() => modifyOrder(order.orderId)} style={{marginRight:'5px', backgroundColor: 'green'}}>Save</button>
                        <button onClick={() => setEditOrderId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditOrderId(order.orderId) || setEditData(order)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'green',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight:'10px'
                          }}>
                          <AutoFixNormalIcon />
                        </button>
                        <button onClick={() => cancelOrder(order.orderId)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}>
                          <CancelIcon />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default CheckOrders;
