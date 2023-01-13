import React from 'react';
import './styles.scss';

const Loading = () => {
  return (
    <div className="p-3 mt-5">
      <div className="card top animated-background">
        <span></span>
      </div>

      <div className="card top-middle animated-background">
        <span></span>
      </div>

      <div className="card middle animated-background">
        <span></span>
      </div>

      <div className="d-flex justify-content-between">
        <div className="card bottom animated-background">
          <span></span>
        </div>
        <div className="card bottom animated-background">
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
