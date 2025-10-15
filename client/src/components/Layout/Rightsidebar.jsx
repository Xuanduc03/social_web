import React, { useEffect, useState } from "react";
import "./Rightsidebar.scss";
import CircleIcon from '@mui/icons-material/Circle';
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_SOCKET_URL}`, { 
  withCredentials: true, 
  transports: ["websocket"] 
});

function Rightsidebar() {
  const [friends, setFriends] = useState(null);
  const [loading, setLoading] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/all-friends`, { 
          withCredentials: true 
        });

        setFriends(res.data.map(friend => ({
          ...friend,
          statusOnline: friend.statusOnline
        })));
        setLoading(false);
      } catch (error) {
        console.log("Error fetching friends:", error);
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    socket.on("SERVER_INITIAL_ONLINE_USERS", (onlineUserIds) => {
      setFriends(prevFriends => {
        if (!Array.isArray(prevFriends)) return prevFriends;
        return prevFriends.map(friend =>
          onlineUserIds.includes(friend._id)
            ? { ...friend, statusOnline: "online" }
            : { ...friend, statusOnline: "offline" }
        );
      });
    });

    return () => {
      socket.off("SERVER_INITIAL_ONLINE_USERS");
    };
  }, []);

  useEffect(() => {
    socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
      setFriends(prevFriends => {
        return prevFriends.map(friend =>
          friend._id === userId
            ? { ...friend, statusOnline: "online" }
            : friend
        );
      });
    });

    return () => {
      socket.off("SERVER_RETURN_USER_ONLINE");
    };
  }, []);

  useEffect(() => {
    socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
      setFriends(prevFriends => {
        if (!Array.isArray(prevFriends)) return prevFriends;
        return prevFriends.map(friend =>
          friend._id === userId
            ? { ...friend, statusOnline: "offline" }
            : friend
        );
      });
    });

    return () => {
      socket.off("SERVER_RETURN_USER_OFFLINE");
    };
  }, []);

  return (
    <>
      {/* Desktop Version */}
      <div className="widget">
        <div className="widgetHeader">
          <h4>Người liên hệ</h4>
        </div>
        <div className="widgetContacts">
          {Array.isArray(friends) && friends.length > 0 ? (
            friends.map((user) => (
              <div key={user._id} className="contactItem">
                <div className="avatarWrapper">
                  <img
                    src={user?.avatarImage[0]?.url || "/default-avatar.png"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="contactAvatar"
                  />
                  <CircleIcon
                    className="onlineIcon"
                    style={{ 
                      color: user.statusOnline === "online" ? "#00ff7f" : "#808080" 
                    }}
                  />
                </div>
                <p>{user.firstName} {user.lastName}</p>
              </div>
            ))
          ) : (
            <p className="noContacts">Không có liên hệ nào</p>
          )}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="mobileWidget">
        <div className="widgetHeader">
          <h4>Liên hệ</h4>
        </div>
        <div className="widgetContacts">
          {Array.isArray(friends) && friends.length > 0 ? (
            friends.slice(0, 5).map((user) => ( // Chỉ hiển thị 5 liên hệ trên mobile
              <div key={user._id} className="contactItem">
                <div className="avatarWrapper">
                  <img
                    src={user?.avatarImage[0]?.url || "/default-avatar.png"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="contactAvatar"
                  />
                  <CircleIcon
                    className="onlineIcon"
                    style={{ 
                      color: user.statusOnline === "online" ? "#00ff7f" : "#808080" 
                    }}
                  />
                </div>
                <p>{user.firstName} {user.lastName}</p>
              </div>
            ))
          ) : (
            <p className="noContacts">Không có liên hệ</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Rightsidebar;