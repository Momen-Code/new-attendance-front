import React from "react";
import { Link } from "react-router-dom";

//Styles
import "./style.scss";

const Splash = () => {
  return (
    <div className="splashContainer">
      <div className="container">
        <h1 className="splashTitle">سلاح الدفاع الجوي</h1>
        <h3 className="splashTitle">وحدة التدريب المشترك د جو</h3>
        <Link to={"/home"} style={{ textDecoration: "none" }}>
          <img src="/images/logo.png" alt="logo" className="splashLogo" />
        </Link>
      </div>
    </div>
  );
};

export default Splash;
