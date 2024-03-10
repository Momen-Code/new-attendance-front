import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { ReactComponent as Send } from "../../assets/images/send.svg";
import { useAppContext } from "../../provider";
import { useParams } from "react-router-dom";

//Styles
import "./style.scss";

const Edit = () => {
  const { type, id } = useParams();
  const { createNotification, setIsLoading } = useAppContext();
  const [formData, setFormData] = useState(getInitialData(type));

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await axios(`http://localhost:5000/${type}s/search`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          id: id,
        },
      });
      if (result.data.data.length === 1) {
        console.log("result: ", result);

        if (type !== "newComers") {
          const { military_number, name, rank } = result.data.data[0];
          setFormData({ military_number, name, rank });
        } else if (type === "newComers") {
          const { military_number, name, rank, detachment } =
            result.data.data[0];
          setFormData({ military_number, name, rank, detachment });
        }
        createNotification("تم جلب البيانات بنجاح", "success");
      } else {
        createNotification("لا يوجد بيانات", "warning");
      }
    } catch (error) {
      console.error("Error:", error);
      createNotification(error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const validationMessage = validateData(type, formData);
      if (validationMessage) {
        createNotification(validationMessage, "warning");
        return;
      }
      const res = await axios.put(
        `http://localhost:5000/${type}s/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (res.data.message) {
        createNotification("تمت التعديل بنجاح", "success");
        handleReset();
        window.location.pathname = "/";
      } else {
        createNotification("لم يتم التعديل", "error");
        handleReset();
      }
    } catch (error) {
      console.error("Error:", error);
      createNotification("حدث خطأ أثناء اضافة البيانات", "error");
      handleReset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(getInitialData(type));
  };

  const validateData = (type, formData) => {
    if (type === "soldier") return validateSoldierData(formData);
    if (type === "officers") return validateOfficersData(formData);
    if (type === "newComers") return validateNewComersData(formData);
  };

  const validateSoldierData = ({ military_number, name, rank }) => {
    if (!military_number) {
      return "برجاء كتابة رقم عسكري!";
    }
    if (!name) {
      return "برجاء كتابة الاسم!";
    }
    if (!rank) {
      return "برجاء كتابة الرتبة!";
    }
    return "";
  };

  const validateOfficersData = ({ military_number, name, rank }) => {
    if (!military_number) {
      return "برجاء كتابة رقم عسكري!";
    }
    if (!name) {
      return "برجاء كتابة الاسم!";
    }
    if (!rank) {
      return "برجاء كتابة الرتبة!";
    }
    return "";
  };

  const validateNewComersData = ({
    military_number,
    name,
    rank,
    detachment,
  }) => {
    if (!military_number) {
      return "برجاء كتابة رقم عسكري!";
    }
    if (!name) {
      return "برجاء كتابة الاسم!";
    }
    if (!rank) {
      return "برجاء كتابة الرتبة!";
    }
    if (!detachment) {
      return "برجاء كتابة الكتيبة!";
    }
    return "";
  };

  return (
    <Layout>
      <div className="editContainer">
        <h3>{getTypeLabel(type)}</h3>
        <div className="container">
          {renderInputFields(type, formData, handleInputChange)}
        </div>
        <button onClick={handleSubmit}>
          <Send />
        </button>
      </div>
    </Layout>
  );
};

export default Edit;

const getTypeLabel = (type) => {
  return type === "soldier"
    ? "قوة اساسية"
    : type === "newComers"
    ? "مستجدين"
    : "ضباط / صف ضباط";
};

const getInitialData = (type) => {
  return type !== "newCommers"
    ? { military_number: "", name: "", rank: "" }
    : { military_number: "", name: "", rank: "", detachment: "" };
};
const renderInputFields = (type, formData, handleInputChange) => {
  const fields = [];

  if (type !== "newComers") {
    fields.push(
      <div key="soldier-field">
        <input
          type="number"
          placeholder="الرقم العسكري..."
          value={formData.military_number}
          onChange={(e) => handleInputChange("military_number", e.target.value)}
        />
        <input
          type="text"
          placeholder="الاسم ..."
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="الرتبة ..."
          value={formData.rank}
          onChange={(e) => handleInputChange("rank", e.target.value)}
        />
      </div>
    );
  } else {
    fields.push(
      <div key="soldier-field">
        <input
          type="number"
          placeholder="الرقم العسكري..."
          value={formData.military_number}
          onChange={(e) => handleInputChange("military_number", e.target.value)}
        />
        <input
          type="text"
          placeholder="الاسم ..."
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="الرتبة ..."
          value={formData.rank}
          onChange={(e) => handleInputChange("rank", e.target.value)}
        />
        <input
          type="text"
          placeholder="الكتيبة ..."
          value={formData.detachment}
          onChange={(e) => handleInputChange("detachment", e.target.value)}
        />
      </div>
    );
  }

  return fields;
};
