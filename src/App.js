import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Style/common.scss";
import "./Style/reset.css";
import Home from './page/Home';
import ManagementLogin from './page/ManagementLogin';
import Login from './page/Login';
import Register from './page/Register';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { auth } from './firebase';
import store from './app/store';
import { login, logout } from './features/userSlice';
import SuccessMessage from './page/SuccessMessage';
import CorporateList from './page/CorporateList/CorporateList';

function App() {

  const user = useSelector((state) => state.user);
  // console.log("user from Redux:", user);

  const dispatch = store.dispatch;

  useEffect(() => {
    auth.onAuthStateChanged((loginUser) => {
      // console.log(loginUser);
      if (loginUser) {
        dispatch(login({
          displayName: loginUser.displayName,
          uid: loginUser.uid,
          email: loginUser.email
        }));
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/success" element={<SuccessMessage />}></Route>
          <Route path="/management-data" element={<ManagementLogin />}></Route>
          <Route path="/management-data-detail" element={<CorporateList />}></Route>
          {/* <Route path="/management" element={<Management />}></Route> */}
        </Routes>
      </Router>
    </>


  );
}

export default App;
