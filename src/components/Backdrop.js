import React from 'react'
import './Backdrop.css'

function Backdrop({hide = true}) {
  return (
    
    <div className='backdrop' style={!hide ? {display:'none'}: {display:'block'}}></div>
  )
}

export default Backdrop