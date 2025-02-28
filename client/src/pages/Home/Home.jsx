import React from "react";
import Rightsidebar from "~/components/Layout/Rightsidebar";
import Sidebar from "~/components/Layout/Sidebar";
import Feed from "~/components/Feed/Feed";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.feed}>
          <Feed />
        </div>
        <div className={styles.rightSidebar}>
          <Rightsidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
