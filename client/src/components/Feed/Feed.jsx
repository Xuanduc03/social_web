import React from 'react'
import "./Feed.scss"
import Story from "./Story"
import MessageSender from './MessageSender'
import Post from './Post'
function Feed() {
  return (
    <div className="feed">
        <Story/>
        <MessageSender/>
        <Post photoURL="" image="https://static.vecteezy.com/system/resources/previews/006/965/779/non_2x/empty-top-wooden-table-and-sakura-flower-with-fog-and-morning-light-background-photo.jpg" username="User 1" time="10:00 AM" message="Post 1"/>
        <Post photoURL="" image="https://storyblok-cdn.photoroom.com/f/191576/768x432/0f78fe60a2/colors-backgrounds-cover.webp" username="User 2" time="1:00 PM" message="Post 2"/>
        <Post photoURL="" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs-Zs1jAhbmypFTiTem5s6YzJpLB4tyD2F_Q&s" username="User 3" time="7:00 PM" message="Post 3"/>
        
    </div>
  )
}

export default Feed