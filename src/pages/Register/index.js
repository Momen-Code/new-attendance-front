import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ReactComponent as Send } from "../../assets/images/send.svg";
import { Layout } from "../../components";
import { useAppContext } from "../../provider";

//Styles
import "./style.scss";

const Register = () => {
  const { type } = useParams();
  const { createNotification, setIsLoading } = useAppContext();
  const [formData, setFormData] = useState(getInitialFormData(type));

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const validationMessage = validateFormData(type, formData);
      if (validationMessage) {
        createNotification(validationMessage, "warning");
        return;
      }
      const res = await axios.post(
        `http://localhost:5000/web/${type}`,
        formData
      );
      if (res.status === 201) {
        createNotification("تمت الاضافة بنجاح", "success");
        handleReset();
      } else {
        createNotification("لم يتم الاضافة", "error");
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
    setFormData(getInitialFormData(type));
  };

  const validateFormData = (type, formData) => {
    if (type === "soldiers") return validateSoldierFormData(formData);
    if (type === "newComers") return validateNewComersFormData(formData);
    if (type === "officers") return validateOfficersFormData(formData);
  };

  const validateSoldierFormData = ({ military_number, name, rank }) => {
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
  const validateNewComersFormData = ({
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

  const validateOfficersFormData = ({ military_number, name, rank }) => {
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

  return (
    <Layout>
      <div className="registerContainer">
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

export default Register;

const getTypeLabel = (type) => {
  return type === "soldiers"
    ? "قوة اساسية"
    : type === "newComers"
    ? "مستجدين"
    : "ضباط / صف ضباط";
};

const getInitialFormData = (type) => {
  return type !== "newComers"
    ? { military_number: 0, name: "", rank: "" }
    : { military_number: 0, name: "", rank: "", detachment: "" };
};

const renderInputFields = (type, formData, handleInputChange) => {
  const fields = [];

  if (type !== "newComers") {
    fields.push(
      <div key="soldiers-field">
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
      <div key="vehicle-fields">
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
          placeholder="الكتية ..."
          value={formData.detachment}
          onChange={(e) => handleInputChange("detachment", e.target.value)}
        />
      </div>
    );
  }

  return fields;
};
