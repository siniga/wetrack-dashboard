import React from 'react'

function FilterButtonsMenue(props) {
    const {children} = props;
  return (
    <>
    <div className="filter-btns-menu">
    {children}
    </div>

    </>
  )
}

export default FilterButtonsMenue