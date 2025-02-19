import React from 'react'
import "./Feed.scss"
import Story from "./Story.jsx"
import MessageSender from './MessageSender'
function Feed() {
  return (
    <div className="feed">
        <Story/>
        <MessageSender/>
    </div>
  )
}

export default Feed