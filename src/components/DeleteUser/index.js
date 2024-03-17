import axios from "axios";
import React from "react";
import { useAppContext } from "../../provider";

//Styles
import "./style.scss";

const DeleteUser = ({ visible, setVisible, id, type }) => {
  const { setIsLoading, createNotification } = useAppContext();
  return (
    visible && (
      <div className="containerDelete">
        <div className="contentContainer">
          <h3>برجاء تأكيد خطوة حذف المستخدم</h3>
          <div className="buttonsContainer">
            <button
              onClick={async (e) => {
                e.preventDefault();
                try {
                  setIsLoading(true);
                  let results = await axios.delete(
                    `http://localhost:5000/dashboard/${type}/${id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "access_token"
                        )}`,
                      },
                    }
                  );

                  if (results.data.success) {
                    setVisible(false);
                    createNotification(results.data.message, "success");
                    return true;
                  } else {
                    createNotification(results.data.error, "error");
                    return false;
                  }
                } catch (error) {
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              تاكيد
            </button>
            <button onClick={() => setVisible(false)}>الغاء</button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteUser;
