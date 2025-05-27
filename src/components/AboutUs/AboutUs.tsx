import React from 'react'
import './AboutUs.css'

export default function AboutUs() {
  return (
    <div className="about-container">
      {/* About Us Section */}
      <div className="about-us">
        <h2>About Us</h2>
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
  )
}