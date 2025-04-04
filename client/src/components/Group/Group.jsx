import React, { useState } from 'react';
import styles from './Group.module.scss';
import classNames from 'classnames/bind';
import {
  PersonAdd as PersonAddIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  MoreHoriz as MoreIcon,
  PhotoCamera as PhotoIcon,
  Videocam as VideoIcon,
  InsertEmoticon as EmojiIcon,
  Event as EventIcon,
  PostAdd as PostIcon,
  GroupAdd as GroupIcon
} from '@mui/icons-material';

const cx = classNames.bind(styles);

const Group = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [postContent, setPostContent] = useState('');
  const [notificationsOn, setNotificationsOn] = useState(false);

  const groupInfo = {
    name: "React Developers Community",
    members: 24500,
    description: "Nơi giao lưu, học hỏi và chia sẻ kiến thức về ReactJS",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    rules: [
      "Tôn trọng các thành viên khác",
      "Không spam quảng cáo",
      "Chia sẻ kiến thức hữu ích"
    ]
  };

  const samplePosts = [
    {
      id: 1,
      author: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?img=1",
      time: "2 giờ trước",
      content: "Mình vừa tạo một ứng dụng React mới, mọi người góp ý nhé!",
      likes: 42,
      comments: 8,
      shares: 3
    },
    {
      id: 2,
      author: "Trần Thị B",
      avatar: "https://i.pravatar.cc/150?img=2",
      time: "5 giờ trước",
      content: "Ai có kinh nghiệm với React 18 và Concurrent Features có thể chia sẻ không?",
      likes: 35,
      comments: 12,
      shares: 5
    }
  ];

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      // Handle post submission
      console.log("Posting:", postContent);
      setPostContent('');
    }
  };

  return (
    <div className={cx("groupContainer")}>
      {/* Cover Section */}
      <div className={cx("coverSection")}>
        <img 
          src={groupInfo.coverImage} 
          alt="Group Cover" 
          className={cx("coverImage")} 
        />
        <div className={cx("coverOverlay")}></div>
        
        <div className={cx("groupHeader")}>
          <div className={cx("groupAvatar")}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png" 
              alt="Group Avatar" 
            />
          </div>
          <div className={cx("groupMeta")}>
            <h1 className={cx("groupName")}>{groupInfo.name}</h1>
            <div className={cx("groupStats")}>
              <span className={cx("statItem")}>
                <GroupIcon fontSize="small" /> 
                {groupInfo.members.toLocaleString()} thành viên
              </span>
              <span className={cx("statItem")}>
                <PostIcon fontSize="small" /> 1.2k bài viết hôm nay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={cx("navBar")}>
        <div className={cx("tabs")}>
          {['Bài viết', 'Thành viên', 'Sự kiện', 'Tệp', 'Ảnh'].map((tab) => (
            <button
              key={tab}
              className={cx("tabButton", { active: activeTab === tab.toLowerCase() })}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className={cx("actions")}>
          <button 
            className={cx("actionBtn", "primary")}
            onClick={() => alert('Invite friends clicked')}
          >
            <PersonAddIcon /> Mời bạn bè
          </button>
          <button 
            className={cx("actionBtn", { active: notificationsOn })}
            onClick={() => setNotificationsOn(!notificationsOn)}
          >
            <NotificationsIcon /> {notificationsOn ? 'Tắt' : 'Bật'} thông báo
          </button>
          <button className={cx("actionBtn")}>
            <SettingsIcon /> Quản lý
          </button>
          <button className={cx("moreBtn")}>
            <MoreIcon />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={cx("mainContent")}>
        {/* Left Column - Posts */}
        <div className={cx("leftColumn")}>
          {/* Create Post */}
          <div className={cx("createPost")}>
            <div className={cx("postHeader")}>
              <img 
                src="https://i.pravatar.cc/40" 
                alt="User" 
                className={cx("userAvatar")} 
              />
              <form onSubmit={handlePostSubmit}>
                <input
                  type="text"
                  placeholder="Bạn muốn chia sẻ điều gì?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className={cx("postInput")}
                />
              </form>
            </div>
            <div className={cx("postActions")}>
              <button className={cx("actionButton")}>
                <PhotoIcon /> Ảnh/Video
              </button>
              <button className={cx("actionButton")}>
                <EventIcon /> Sự kiện
              </button>
              <button className={cx("actionButton")}>
                <EmojiIcon /> Cảm xúc
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className={cx("postsFeed")}>
            {samplePosts.map(post => (
              <div key={post.id} className={cx("postCard")}>
                <div className={cx("postHeader")}>
                  <img src={post.avatar} alt={post.author} className={cx("postAvatar")} />
                  <div className={cx("postAuthor")}>
                    <h4>{post.author}</h4>
                    <span className={cx("postTime")}>{post.time}</span>
                  </div>
                  <button className={cx("postMenu")}>
                    <MoreIcon />
                  </button>
                </div>
                <div className={cx("postContent")}>
                  <p>{post.content}</p>
                </div>
                <div className={cx("postStats")}>
                  <span>{post.likes} lượt thích</span>
                  <span>{post.comments} bình luận</span>
                  <span>{post.shares} chia sẻ</span>
                </div>
                <div className={cx("postActions")}>
                  <button className={cx("postAction")}>Thích</button>
                  <button className={cx("postAction")}>Bình luận</button>
                  <button className={cx("postAction")}>Chia sẻ</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className={cx("rightColumn")}>
          {/* About Group */}
          <div className={cx("sidebarCard")}>
            <h3>Giới thiệu về nhóm</h3>
            <p>{groupInfo.description}</p>
            <div className={cx("sidebarStat")}>
              <GroupIcon /> {groupInfo.members.toLocaleString()} thành viên
            </div>
            <div className={cx("sidebarStat")}>
              <EventIcon /> Đã tạo vào 15/03/2020
            </div>
          </div>

          {/* Group Rules */}
          <div className={cx("sidebarCard")}>
            <h3>Nội quy nhóm</h3>
            <ul className={cx("rulesList")}>
              {groupInfo.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Search */}
          <div className={cx("sidebarCard", "searchBox")}>
            <div className={cx("searchContainer")}>
              <SearchIcon className={cx("searchIcon")} />
              <input
                type="text"
                placeholder="Tìm kiếm trong nhóm"
                className={cx("searchInput")}
              />
            </div>
          </div>

          {/* Recent Media */}
          <div className={cx("sidebarCard")}>
            <h3>Media gần đây</h3>
            <div className={cx("mediaGrid")}>
              {[1, 2, 3, 4].map(item => (
                <div key={item} className={cx("mediaItem")}>
                  <img 
                    src={`https://source.unsplash.com/random/200x200?sig=${item}`} 
                    alt={`Media ${item}`} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;