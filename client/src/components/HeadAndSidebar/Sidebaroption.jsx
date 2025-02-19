import { Avatar } from '@mui/material'
import React from 'react'
import "./sidebarRow.scss"
function Sidebaroption({src,Icon, title}) {
  return (
    <div className="sidebarRow">
        {src && <Avatar src={src}/>}
        {Icon && <Icon src={src}/>}
        <p>{title}</p>

    </div>
  )
}

export default Sidebaroption