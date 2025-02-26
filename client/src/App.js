import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import publicRoute from "./routes";
import { ToastContainer } from 'react-toastify';
import Header from './components/Layout/Header';
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <ToastContainer />
        <Routes>
          {publicRoute.map((pages, index) => {
            const Page = pages.component;
            return <Route key={index} path={pages.path} element={<Page />} />;
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
