import React from "react";
import "./loadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="glass-loader">
        <div className="ring ring1"></div>
        <div className="ring ring2"></div>
        <div className="ring ring3"></div>
        <span className="loading-text">Fetching the showtime magic...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;