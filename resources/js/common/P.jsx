import React from 'react'

const P = ({children,className,id}) => {
  return (
    <p className={className} id={id}>
        {children}
    </p>
  )
}

export default P
