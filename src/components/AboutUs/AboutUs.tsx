import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-container">
      {/* Navigation Menu */}
      <nav className="nav-menu">
        <button className="nav-button">Homepage</button>
        <button className="nav-button">Meeting Rooms</button>
        <button className="nav-button">Sport Booking</button>
        <button className="nav-button">Sign Up</button>
      </nav>

      {/* About Us Section */}
      <div className="about-us">
        <h2>About US</h2>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="image-container">
          <div className="image-placeholder">PNG</div>
        </div>
        <div className="image-container">
          <div className="image-placeholder">PNG</div>
        </div>
      </div>

      {/* Description Section */}
      <div className="description-section">
        <p>Description</p>
      </div>
    </div>
  );
};

export default AboutUs;