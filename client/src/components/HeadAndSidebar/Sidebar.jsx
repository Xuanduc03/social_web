import React from 'react'
import Sidebaroption from './Sidebaroption'
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import "./Sidebar.scss"
function sidebar() {
  return (
    <div className="sidebar">
        <Sidebaroption Icon={PersonIcon} title="User"/>
        <Sidebaroption Icon={PeopleIcon} title="Friends"/>
    </div>
  )
}

export default sidebar