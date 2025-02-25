import { useEffect } from "react";
import "./App.css";
import Header from "./components/HeadAndSidebar/Header";
// import Sidebar from "./components/HeadAndSidebar/Sidebar";
// import Feed from "./components/Feed/Feed";
// import Rightsidebar from "./components/HeadAndSidebar/Rightsidebar";
import Profile from "./components/Profile/Profile";
function App() {
  useEffect(() => {
    document.title = "Social Web";
  }, []);

  return (
    <div className="App">
      <Header/>

      {/* <div className="appBody">
        <Sidebar/>
        <Feed/>
        <Rightsidebar/>
      </div> */}
      <div className="appBody">
        <Profile/>
      </div>
    </div>
  );
}

export default App;
