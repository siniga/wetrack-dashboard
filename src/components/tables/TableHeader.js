import React from "react";

function TableHeader(props) {
const {columns, style} = props;

  return(
    <>
    <div className="table-hdr">
    {
    columns && columns.map((item, i)=>{
        return  <div key={i} className="hr-hdr-item" style={style}>{item}</div>
    })
   }
    </div>
   
    </>
  )
}

export default TableHeader;
