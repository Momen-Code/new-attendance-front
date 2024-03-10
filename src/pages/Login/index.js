import axios from "axios";
import React, { useState } from "react";
import { Layout } from "../../components";
import { useAppContext, useAuthContext } from "../../provider";

//Styles
import "./style.scss";

const Login = () => {
  const { createNotification, setIsLoading } = useAppContext();
  const { setIsLoggedIn } = useAuthContext();
  const [data, setData] = useState({ username: "", password: "" });

  return (
    <Layout>
      <div className="loginContainer">
        <div className="container">
          <div>
            <label>الاسم</label>
            <label>كلمة المرور</label>
          </div>
          <div>
            <input
              type="text"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
        </div>
        <button
          onClick={async () => {
            try {
              setIsLoading(true);

              if (!data.username || !data.password) {
                createNotification(
                  "يجب ادخال اسم المستخدم وكلمة المرور",
                  "warning"
                );
                return;
              }

              const res = await axios.post(
                "http://localhost:5000/dashboard/auth/login",
                data
              );

              if (res.data.token) {
                const expiresIn = 3600;
                const expirationTime = new Date().getTime() + expiresIn * 1000; // Convert seconds to milliseconds

                createNotification("تم تسجيل الدخول بنجاح", "success");
                localStorage.setItem("access_token", res.data.token);
                localStorage.setItem(
                  "access_token_expires_at",
                  expirationTime.toString()
                );

                setIsLoggedIn(true);
              } else {
                createNotification(
                  "خطأ في اسم المستخدم او كلمة المرور",
                  "error"
                );
              }
            } catch (error) {
              createNotification(error, "error");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          تسجيل الدخول
        </button>
      </div>
    </Layout>
  );
};

export default Login;
