/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./ProfileSidebar.scss";

const ProfileSidebar = () => {
  return (
    <div className="profile-sidebar">
      <div className="sidebar-section">
        <h3>Giới thiệu</h3>
        <p>Đây là phần giới thiệu ngắn về người dùng.</p>
        <button>Chỉnh sửa chi tiết</button>
      </div>
      
      <div className="sidebar-section">
        <h3>Ảnh</h3>
        <a href="#">Xem tất cả ảnh</a>
        <div className="photos-grid">
          <img src="https://scontent.fhan7-1.fna.fbcdn.net/v/t39.30808-6/453484982_1205625697247072_7901535588468382345_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=1lI7YyCV7zwQ7kNvgEfIfJu&_nc_oc=AdiXIp5CLnD1fKquzGnvhjOa4fudDTHTRWU6gFG9azkXRpg-qPgHIA9b6evsbxxVOa8&_nc_zt=23&_nc_ht=scontent.fhan7-1.fna&_nc_gid=ApPN-vZiYDXCFMzn4viX88C&oh=00_AYBfVGSDHFcMBfNFMRIou1xURD-IyXGXnlQnYNd4tdjtJg&oe=67C3F3F5" alt="Ảnh 1" />
          <img src="https://scontent.fhan7-1.fna.fbcdn.net/v/t39.30808-6/449060006_1182726546203654_501216162168122159_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=Msd4AbDD-ZYQ7kNvgFfiqob&_nc_oc=AdigDuixByH4qmKzp-xxHQViG_qCnqb229OubrsHQKJ9WHLLqfqq6x4OdU5GkcqensI&_nc_zt=23&_nc_ht=scontent.fhan7-1.fna&_nc_gid=AzZ5ZeoVQZLDVLpRz_HsbN9&oh=00_AYAs7gpHJJt35cDzs17dTOKT0F51nbogs1mgt42Hk6R0UQ&oe=67C4071D" alt="Ảnh 2" />
          <img src="https://scontent.fhan7-1.fna.fbcdn.net/v/t39.30808-6/481659792_1347903486352625_720803908641093299_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=XK0zILmBsOMQ7kNvgGHEjcK&_nc_oc=AdimHemExlvs5V1ouuSkt0iybjK-WH5btwxYqrGrrykNy144b0CTeklYGOjWi87EIVc&_nc_zt=23&_nc_ht=scontent.fhan7-1.fna&_nc_gid=AcT2OWo0f1fRQJbQPCld1Mu&oh=00_AYD4U-i6e78nqznMJCkXdtR1aiB083chD5T0aLGlAXJsvA&oe=67C3F83D" alt="Ảnh 3" />
        </div>
       
      </div>

      <div className="sidebar-section">
        <h3>Bạn bè</h3>
        <p>Count Friend</p>
        <a href="#">Xem tất cả bạn bè</a>
      </div>
    </div>
  );
};

export default ProfileSidebar;
