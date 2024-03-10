import { createContext, useContext, useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const AppContext = createContext(null);
const AuthContext = createContext(null);

export const useAppContext = () => useContext(AppContext);
export const useAuthContext = () => useContext(AuthContext);

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("access_token") ? true : false
  );
  const [isLoading, setIsLoading] = useState(false);

  const createNotification = (message = "", type = "error") => {
    switch (type) {
      case "info":
        NotificationManager.info(message);
        break;
      case "success":
        NotificationManager.success(message);
        break;
      case "warning":
        NotificationManager.warning(message);
        break;
      case "error":
        NotificationManager.error(message);
        break;
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setIsLoggedIn(false);
    } else {
      if (
        localStorage.getItem("access_token") &&
        localStorage.getItem("access_token_expires_at")
      ) {
        const currentTime = new Date().getTime();

        if (
          currentTime <
          parseInt(localStorage.getItem("access_token_expires_at"), 10)
        ) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log(isLoading);
    }
  }, [isLoggedIn]);

  return (
    <AppContext.Provider
      value={{ createNotification, isLoading, setIsLoading }}
    >
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <NotificationContainer />
        {children}
      </AuthContext.Provider>
    </AppContext.Provider>
  );
};
