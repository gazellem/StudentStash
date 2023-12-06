import React from "react";
import './listing.css';

function listing() {
    return (
        <div className="card">
          <div className="header">Card Header</div>
          <button className="save-button">Save</button>
          <div className="subhead">Subhead Text</div>
          <div className="tags">
            <div className="tag">Tag 1</div>
            <div className="tag">Tag 2</div>
            <div className="tag">Tag 3</div>
            {/* Add more tags as needed */}
          </div>
          <div className="footer">
            <div className="price">$99.99</div>
            <div className="time">Posted 2 hours ago</div>
          </div>
        </div>
      );
     
}

export default listing;