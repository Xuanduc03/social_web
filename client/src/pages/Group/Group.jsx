import React, { useState, useEffect } from "react";
import styles from "./Group.module.scss";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Post from "~/components/Post/Post";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

const socket = io("http://localhost:8080", { withCredentials: true });

const Group = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false); // State cho hộp thoại xác nhận

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupResponse = await axios.get(`http://localhost:8080/api/groups/${groupId}`, {
          withCredentials: true,
        });
        if (groupResponse.data.success) {
          console.log("Group data:", groupResponse.data.data);
          setGroup(groupResponse.data.data);
          setPosts(groupResponse.data.data.posts || []);
        }

        const userResponse = await axios.get("http://localhost:8080/api/me", {
          withCredentials: true,
        });
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
      setPosts((prev) => [newPost, ...prev]);
    });

    return () => {
      socket.off("newGroupPost");
    };
  }, [groupId]);

  const handleImageError = (e) => {
    console.log("Image failed to load:", e.target.src);
    e.target.src = "https://via.placeholder.com/300x150";
  };

  const handlePostSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/groups/${groupId}/posts`,
        { content: postContent },
        { withCredentials: true }
      );
      if (response.data.success) {
        setPostContent("");
      }
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
    }
  };

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
          members: [
            ...prev.members,
            { user: { _id: currentUser._id, firstName: currentUser.firstName, lastName: currentUser.lastName } },
          ],
        }));
        alert("Bạn đã tham gia nhóm thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi tham gia nhóm:", error);
      alert("Lỗi khi tham gia nhóm: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm("Bạn có chắc muốn xóa nhóm này? Hành động này không thể hoàn tác.")) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/groups/${groupId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          alert("Xóa nhóm thành công!");
          navigate("/groups");
        }
      } catch (error) {
        console.error("Lỗi khi xóa nhóm:", error);
        alert("Lỗi khi xóa nhóm: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // Hàm hiển thị hộp thoại xác nhận
  const confirmJoinGroup = () => {
    setShowJoinConfirm(true);
  };

  // Xử lý khi chọn "Có"
  const handleConfirmYes = () => {
    setShowJoinConfirm(false);
    handleJoinGroup();
  };

  // Xử lý khi chọn "Không"
  const handleConfirmNo = () => {
    setShowJoinConfirm(false);
  };

  if (!group || !currentUser) return <div>Loading...</div>;

  return (
    <div className={styles.groupContainer}>
      <div className={styles.coverSection}>
        <img
          src={group.coverImage ? `${group.coverImage}?t=${Date.now()}` : "https://via.placeholder.com/300x150"}
          alt="Group Cover"
          className={styles.coverImage}
          onError={handleImageError}
          onLoad={() => console.log("Image loaded:", group.coverImage)}
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
          <button className={styles.actionBtn} onClick={confirmJoinGroup}>
            <PersonAddIcon fontSize="small" /> Tham gia nhóm
          </button>
          <button className={styles.actionBtn}>
            <NotificationsIcon fontSize="small" /> Bật thông báo
          </button>
          {group.creator._id === currentUser._id && (
            <>
              <button className={styles.actionBtn}>
                <SettingsIcon fontSize="small" /> Quản lý
              </button>
              <button className={styles.actionBtn} onClick={handleDeleteGroup} data-delete>
                <DeleteIcon fontSize="small" /> Xóa nhóm
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hộp thoại xác nhận tham gia nhóm */}
      {showJoinConfirm && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmContent}>
            <h3>Bạn có muốn tham gia nhóm này không?</h3>
            <div className={styles.confirmButtons}>
              <button onClick={handleConfirmYes} className={styles.confirmYes}>
                Có
              </button>
              <button onClick={handleConfirmNo} className={styles.confirmNo}>
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          <div className={styles.postCreator}>
            <img src={currentUser.avatarImage || "https://i.pravatar.cc/40"} alt="Avatar" className={styles.avatar} />
            <input
              type="text"
              placeholder="Bạn đang nghĩ gì?"
              className={styles.postInput}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handlePostSubmit()}
            />
          </div>

          <div className={styles.postsFeed}>
            {posts.map((post) => (
              <Post key={post._id} {...post} />
            ))}
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

          <div className={styles.searchBox}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm trong nhóm"
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;