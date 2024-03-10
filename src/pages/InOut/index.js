import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../components";

//Style
import "./style.scss";

const InOut = () => {
  return (
    <Layout>
      <div className="inOutContainer">
        <Link to={`/actions/in`}>تسجيل دخول</Link>
        <Link to={"/actions/out"}>تسجيل خروج</Link>
      </div>
    </Layout>
  );
};

export default InOut;
