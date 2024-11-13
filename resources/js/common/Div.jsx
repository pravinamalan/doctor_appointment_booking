import React from 'react'

const Div = ({ className, id, children,onClick,  }) => {
  return (
    <div className={className} id={id} onClick={onClick}>
        {children}
    </div>
  )
}

export default Div
