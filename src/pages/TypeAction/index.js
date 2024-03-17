import React from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../../components";

//Styles
import "./style.scss";

const TypeAction = () => {
  const { type, status } = useParams();

  return (
    <Layout>
      <div className="typeActionContainer">
        <h3>
          {type === "soldiers" ? (
            <>
              قوة اساسية
              <Link to={`/${type}/registration`}>اضافة</Link>
            </>
          ) : type === "newComers" ? (
            <>
              المستجدين
              <Link to={`/${type}/registration`}>اضافة</Link>
            </>
          ) : (
            <>
              ضباط / صف ضباط
              <Link to={`/${type}/registration`}>اضافة</Link>
            </>
          )}
        </h3>
        <Link to={`/${status}/barcode/${type}`}>مسح باركود</Link>
      </div>
    </Layout>
  );
};

export default TypeAction;
