import React, { useState } from 'react';
import axios from 'axios';
import "./BuyShoes.css";
import { API_URL } from "../utils.js";

const shoesData = [
  { name: 'Airmax', imgSrc: 'https://edwin01.s3.ap-south-1.amazonaws.com/airmax.jpg', price: 16000 },
  { name: 'Vans', imgSrc: 'https://edwin01.s3.ap-south-1.amazonaws.com/vans.webp', price: 15000 },
  { name: 'Nike-SB', imgSrc: 'https://edwin01.s3.ap-south-1.amazonaws.com/nike-sb.png', price: 20000 },
  { name: 'AJ Legacy 312', imgSrc: 'https://edwin01.s3.ap-south-1.amazonaws.com/legacy.avif', price: 25000 }
];

// PopupMessage Component
const PopupMessage = ({ message, onClose }) => (
  <div className="popup">
    <div className="popup-content">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const BuyShoes = ({ goBack }) => {
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zipcode: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const handleSelectShoe = (shoe) => {
    setSelectedShoe(shoe);
    setIsBuying(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBuyNow = () => {
    setIsBuying(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShoe) return;

    const orderData = {
      shoe: selectedShoe.name,
      quantity: quantity,
      price: selectedShoe.price,
      ...formData
    };

    try {
      const response = await axios.post(`${API_URL}/placeOrder`, orderData);
      setMessage(response.data.message || "Order placed successfully!");
      setShowPopup(true); // Show popup on successful order
      setIsBuying(false); // Collapse the form
      setSelectedShoe(null); // Deselect the shoe
    } catch (error) {
      console.error("Error placing order:", error);
      setMessage("Failed to place order. Please try again.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setMessage(''); // Clear the message after closing the popup
  };

  return (
    <div className="main">
      <div className="header">
        <button onClick={goBack} className="back-btn">Back</button>
        <center><h1>Collection</h1></center>
      </div>
      <div className="shoe-container">
        {shoesData.map((shoe, index) => (
          <div key={index} className={`shoe-item ${selectedShoe === shoe ? 'selected' : 'not-selected'}`} onClick={() => handleSelectShoe(shoe)}>
            <img src={shoe.imgSrc} alt={shoe.name} width="100%" height="80%" />
            <br />
            {shoe.name}
            {selectedShoe === shoe && <p>Price: Rs. {shoe.price}</p>}
          </div>
        ))}
      </div>
      <center>
        <p>{selectedShoe ? `Your Choice: ${selectedShoe.name}` : 'No Shoe selected'}</p>
        {selectedShoe && !isBuying && (
          <>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <h2>Total price: Rs. {selectedShoe.price * quantity}</h2>
            <button onClick={handleBuyNow}>Buy now</button>
          </>
        )}
        {isBuying && (
          <form onSubmit={handleSubmit}> 
            <div>
              <label htmlFor="name">Name </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Phone Number </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="zipcode">Zipcode</label>
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit Order</button>
          </form>
        )}
        {showPopup && <PopupMessage message={message} onClose={closePopup} />} {/* Display popup */}
      </center>
    </div>
  );
};

export default BuyShoes;
