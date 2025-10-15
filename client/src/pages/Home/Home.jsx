import React from "react";
import Rightsidebar from "~/components/Layout/Rightsidebar";
import Sidebar from "~/components/Layout/Sidebar";
import Feed from "~/components/Feed/Feed";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        {/* Desktop Sidebar */}
        <div className={styles.sidebar}>
          <Sidebar />
        </div>

        {/* Mobile Sidebar sẽ tự động hiển thị trong component Sidebar */}
        
        {/* Main Feed */}
        <div className={styles.feed}>
          <Feed />
        </div>

        {/* Right Sidebar */}
        <div className={styles.rightSidebar}>
          <Rightsidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;