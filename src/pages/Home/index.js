import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../components";

//Styles
import "./style.scss";

const Home = () => {
  return (
    <Layout>
      <div className="homeContainer">
        <Link to={"/login"}>مدير</Link>
        <Link to={"/inOut"}>مستخدم</Link>
      </div>
    </Layout>
  );
};

export default Home;
