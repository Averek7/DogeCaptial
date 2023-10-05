import React, { useState, useEffect } from 'react';

const Error = ({ errorMessage }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsVisible(true);

      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5000); 

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [errorMessage]);

  return (
    <div className={`error-message ${isVisible ? 'visible' : 'hidden'}`}>
      {errorMessage}
    </div>
  );
};

export default Error;
