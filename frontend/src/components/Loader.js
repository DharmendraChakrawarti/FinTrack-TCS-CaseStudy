import React from 'react';
import './Loader.css';

const Loader = () => (
  <div className="loader-container">
    <div className="loader-spinner">
      <div className="loader-ring"></div>
      <div className="loader-ring"></div>
      <div className="loader-ring"></div>
    </div>
    <p className="loader-text">Loading...</p>
  </div>
);

export default Loader;
