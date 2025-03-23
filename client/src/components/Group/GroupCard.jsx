import React from "react";
import { Link } from "react-router-dom";
import "./GroupCard.scss";

function GroupCard({ group }) {
  return (
    <div className="groupCard">
      <img src={group.coverImage || "https://via.placeholder.com/300x150"} alt="Cover" />
      <div className="groupInfo">
        <h3>{group.name}</h3>
        <p>{group.members.length} thành viên</p>
        <Link to={`/groups/${group._id}`} className="viewGroup">Xem nhóm</Link>
      </div>
    </div>
  );
}

export default GroupCard;