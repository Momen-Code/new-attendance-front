import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../provider";

//Styles
import "./style.scss";

const Layout = ({ children }) => {
  const { isLoggedIn } = useAuthContext();
  return (
    <div className="layoutContainer">
      {isLoggedIn && (
        <div className="logoutButton">
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              window.location.reload();
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      )}
      <div className="container">
        <div className="leftC">
          <h1 className="layoutTitle">سلاح الدفاع الجوي</h1>
          <h3 className="layoutTitle">وحدة التدريب المشترك د جو</h3>
          <div>
            <Link to={"/inOut"} style={{ textDecoration: "none" }}>
              <img src="/images/logo.png" alt="logo" className="layoutLogo" />
            </Link>
          </div>
        </div>
        <div className="rightC">
          <div className="bgImage">
            <img src="/images/logo.png" alt="bg" />
          </div>
          {/* <div className="header">user</div> */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
