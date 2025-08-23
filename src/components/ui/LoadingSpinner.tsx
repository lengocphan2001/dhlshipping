import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  text?: string;
  showText?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Loading...',
  showText = true 
}) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className="loading-spinner-wrapper">
        <div className={`loading-spinner ${color}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      </div>
      {showText && (
        <div className="loading-text">
          <span className="loading-dots">
            {text.split('').map((char, index) => (
              <span 
                key={index} 
                className="loading-char"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
