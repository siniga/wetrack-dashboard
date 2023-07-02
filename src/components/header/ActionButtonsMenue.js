import React from 'react'

function ActionButtonsMenue(props) {
    const {children} = props;
  return (
    <>
      <div className="action-btns-menu">
          {children}
      </div>
    </>
  );
}

export default ActionButtonsMenue