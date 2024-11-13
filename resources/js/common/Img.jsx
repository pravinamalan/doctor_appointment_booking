import React from 'react'

export const Img = ({className, id, src,alt}) => {
  return (
    <img className={className} id={id} src={src} alt={alt}></img>
  )
}
