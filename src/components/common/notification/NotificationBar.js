import React, { useState, useEffect } from 'react';
import './Notification.css'

const NotificationBar = ({showNotification,setShowNotification, message}) => {

  useEffect(() => {
    let timer;
    if (showNotification) {
      timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Hide the notification after 3 seconds (adjust as needed)
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showNotification]);


  return (
    <div>
      {showNotification && (
        <div className="notification-bar">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
