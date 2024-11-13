import React, { forwardRef } from 'react';

const Input = forwardRef(({ name, accept, onChange, hidden = true ,type,className,id,value }, ref) => {
  return (
    <input
        ref={ref}
        type={type}
        className={className}
        id={id}
        name={name}
        value={value}
        accept={accept}
        hidden={hidden}
        onChange={onChange}
    />
  )
})

export default Input
