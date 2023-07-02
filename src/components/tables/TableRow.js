import React from 'react'

function TableRow(props) {
    const {children, rows, key,onClick} = props;
  return (
    <>
      <div key={key} className="table-row" onClick={onClick}>{children}</div>
    </>
  )
}

export default TableRow