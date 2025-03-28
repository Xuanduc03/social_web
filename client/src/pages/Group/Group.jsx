import React, { useState, useEffect } from "react";
import styles from "./Group.module.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import UpGroupPost from "~/components/Group/UpGroupPost";
import GroupPost from "~/components/Group/GroupPost";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";

const socket = io("http://localhost:8080", { withCredentials: true });

const Group = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupResponse = await axios.get(`http://localhost:8080/api/groups/${groupId}`, { withCredentials: true });
        if (groupResponse.data.success) {
          setGroup(groupResponse.data.data);
          // Sắp xếp bài viết theo createdAt giảm dần (mới nhất lên đầu)
          const sortedPosts = (groupResponse.data.data.posts || []).sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
        }
        const userResponse = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
        if (userResponse.data.success) {
          setCurrentUser(userResponse.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchGroup();

    socket.emit("joinGroup", groupId);
    socket.on("newGroupPost", (newPost) => {
      setPosts((prev) => [newPost, ...prev]); // Bài mới nhất sẽ lên đầu
    });

    return () => socket.off("newGroupPost");
  }, [groupId]);

  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/groups/${groupId}/join`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setGroup((prev) => ({
          ...prev,
          members: [...prev.members, { user: { _id: currentUser._id, firstName: currentUser.firstName, lastName: currentUser.lastName } }],
        }));
        toast.success("Bạn đã tham gia nhóm thành công!");
      }
    } catch (error) {
      toast.error("Lỗi khi tham gia nhóm: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm("Bạn có chắc muốn xóa nhóm này?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/groups/${groupId}`, { withCredentials: true });
        if (response.data.success) {
          toast.success("Xóa nhóm thành công!");
          navigate("/groups");
        }
      } catch (error) {
        toast.error("Lỗi khi xóa nhóm: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    socket.emit("newGroupPost", newPost);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  if (!group || !currentUser) return <div>Loading...</div>;

  const isMember = group.members.some((member) => member.user._id === currentUser._id);

  return (
    <div className={styles.groupContainer}>
      <div className={styles.coverSection}>
        <img
          src={group.coverImage || "https://via.placeholder.com/300x150"}
          alt="Group Cover"
          className={styles.coverImage}
        />
        <div className={styles.groupHeader}>
          <h1 className={styles.groupName}>{group.name}</h1>
          <div className={styles.groupStats}>
            <span>{group.members.length.toLocaleString()} thành viên</span>
          </div>
          <p className={styles.groupDesc}>{group.description}</p>
        </div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.tabs}>
          {["Bài viết", "Thành viên", "Sự kiện", "Media"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab.toLowerCase() ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          {!isMember && (
            <button className={styles.actionBtn} onClick={handleJoinGroup}>
              <PersonAddIcon fontSize="small" /> Tham gia nhóm
            </button>
          )}
          <button className={styles.actionBtn}>
            <NotificationsIcon fontSize="small" /> Bật thông báo
          </button>
          {group.creator._id === currentUser._id && (
            <>
              <button className={styles.actionBtn}>
                <SettingsIcon fontSize="small" /> Quản lý
              </button>
              <button className={styles.actionBtn} onClick={handleDeleteGroup}>
                <DeleteIcon fontSize="small" /> Xóa nhóm
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.groupInfoBox}>
          <h3>Thông tin nhóm</h3>
          <p>{group.description}</p>
          <div className={styles.memberCount}>
            <PersonAddIcon fontSize="small" /> {group.members.length.toLocaleString()} thành viên
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <UpGroupPost groupId={groupId} onPostCreated={handlePostCreated} isMember={isMember} />
          <div className={styles.postsFeed}>
          {posts.map((post) => (
            <GroupPost
              key={post._id}
              userId={post.user._id}
              id={post._id}
              checkLiked={currentUser._id}
              photoURL={post.user.avatarImage}
              images={post.images}
              likes={post.likes}
              comments={post.comments}
              username={`${post.user.firstName} ${post.user.lastName}`}
              time={post.createdAt}
              message={post.content}
              onUpdate={handlePostUpdate} // Thêm callback để cập nhật
              onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
              isMember={isMember}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;