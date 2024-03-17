import React from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../../components";

//Style
import "./style.scss";

const Actions = () => {
  const { type } = useParams();

  return (
    <Layout>
      <div className="actionsContainer">
        <h3>{type === "in" ? "تسجيل دخول" : "تسجيل خروج"}</h3>
        <Link to={`/${type}/type-action/newComers`}>مستجدين</Link>
        <Link to={`/${type}/type-action/soldiers`}>قوة اساسية</Link>
        <Link to={`/${type}/type-action/officers`}>ضباط / صف ضباط</Link>
      </div>
    </Layout>
  );
};

export default Actions;
