import React from "react";
import "./Rightsidebar.scss";

const users = [
  { id: 1, name: "User 1", avatar: "" },
  { id: 2, name: "User 2", avatar: "" },
  { id: 3, name: "User 3", avatar: "" }
];

function Rightsidebar() {
  return (
    <div className="widget">
      <div className="widgetHeader">
        <h4>Contact</h4>
      </div>
      <div className="widgetContacts">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="contactItem">
              <img src={user.avatar} alt={user.name} className="contactAvatar" />
              <p>{user.name}</p>
            </div>
          ))
        ) : (
          <p>No contacts available</p>
        )}
      </div>
    </div>
  );
}

export default Rightsidebar;