import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactComponent as Send } from "../../assets/images/send.svg";
import { Layout } from "../../components";
import { formatDateToArabic } from "../../helpers";
import { useAppContext } from "../../provider";

//Style
import "./style.scss";

const Barcode = () => {
  const { type, status } = useParams();
  const { createNotification, setIsLoading } = useAppContext();
  const [viewResult, setViewResult] = useState(false);
  const [result, setResult] = useState({});
  const [identifierType, setIdentifierType] = useState("");
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
      let res;
      if (type !== "officers") {
        res = await axios.get(
          `http://localhost:5000/web/${type}/${formData.military_number}`,
          {
            params: formData,
          }
        );
      } else {
        res = await axios.get(
          `http://localhost:5000/web/${type}/${formData.name}`,
          {
            params: formData,
          }
        );
      }

      if (res.data.success && res.data.data) {
        setResult(res.data.data);
        createNotification("تم العثور على البيانات بنجاح", "success");
        setViewResult(true);
      } else {
        createNotification("لم يتم العثور على البيانات", "error");
        handleReset();
      }
    } catch (error) {
      console.error("Error:", error);
      createNotification("حدث خطأ أثناء البحث عن البيانات", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateFormData = (type, formData) => {
    if (type === "soldiers") return validateSoldierFormData(formData);
    if (type === "newComers") return validateNewComersFormData(formData);
    if (type === "officers") return validateOfficersFormData(formData);
  };

  const validateSoldierFormData = ({ military_number }) => {
    if (!military_number) {
      return "برجاء كتابة رقم عسكري!";
    }
    return "";
  };

  const validateNewComersFormData = ({ military_number }) => {
    if (!military_number) {
      return "برجاء كتابة رقم عسكري!";
    }
    return "";
  };

  const validateOfficersFormData = ({ name }) => {
    if (!name) {
      return "برجاء كتابة الاسم!";
    }

    return "";
  };

  const handleReset = () => {
    setViewResult(false);
    setResult({});
    setFormData(getInitialFormData(type));
  };

  useEffect(() => {
    console.log("identifierType: ", identifierType);
  }, [identifierType]);

  return (
    <Layout>
      <div className="barcodeContainer">
        <h3>{getTypeLabel(type)}</h3>
        {!viewResult ? (
          <>
            <div className="container">
              {renderInputFields(
                type,
                formData,
                handleInputChange,
                identifierType,
                setIdentifierType
              )}
            </div>
            <button onClick={handleSubmit}>
              <Send />
            </button>
          </>
        ) : (
          <div className="resultsContainer">
            <h3>البيانات</h3>
            <div className="container">
              <div>{renderResultLabels(type, result)}</div>
              <div className="dataC">{renderResultData(type, result)}</div>
            </div>
            <div className="btnContainer">
              <button
                onClick={async () => {
                  setIsLoading(true);
                  if (result.status === status) {
                    createNotification(
                      status === "in"
                        ? "العسكري موجود بالفعل"
                        : "العسكري في الخارح بالفعل",
                      "warning"
                    );
                    setIsLoading(false);
                    return;
                  }
                  const res = await axios.post(
                    `http://localhost:5000/web/attendance`,
                    { user: result._id, status: status, type }
                  );

                  if (res.data.success) {
                    createNotification("تم الحفظ بنجاح", "success");
                    handleReset();
                    setViewResult(false);
                    setIsLoading(false);
                  } else if (!res.data.status) {
                    createNotification(res.data.error, "error");
                    setViewResult(false);
                    setIsLoading(false);
                  }
                }}
              >
                حفظ
              </button>
              <button onClick={handleReset}>اعادة</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Barcode;

// Helper functions

const getInitialFormData = (type) => {
  return type === "soldiers"
    ? { military_number: undefined }
    : type === "newComers"
    ? { military_number: undefined }
    : {
        name: undefined,
      };
};

const getTypeLabel = (type) => {
  return type === "soldiers"
    ? "قوة اساسية"
    : type === "newComers"
    ? "مستجدين"
    : "ضباط / صف ضباط";
};

const renderInputFields = (
  type,
  formData,
  handleInputChange,
  identifierType,
  setIdentifierType
) => {
  const fields = [];

  if (type !== "officers") {
    fields.push(
      <div key="soldiers-field">
        <input
          type="number"
          placeholder="الرقم العسكري..."
          value={formData.military_number}
          onChange={(e) => handleInputChange("military_number", e.target.value)}
        />
      </div>
    );
  } else {
    fields.push(
      <div>
        <input
          type="text"
          placeholder="الاسم ..."
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>
    );
  }
  return fields;
};

const renderResultLabels = (type, result) => {
  let labels = [];

  if (type !== "newComers") {
    labels = ["الرتبة", "الاسم", "الرقم العسكري", "الوقت"];
  } else {
    labels = ["الرتبة", "الاسم", "الرقم العسكري", "الكتية", "الوقت"];
  }

  return labels.map((label, index) => <label key={index}>{label}</label>);
};

const renderResultData = (type, result) => {
  let data = [];

  if (type !== "newComers") {
    data = [
      result.rank,
      result.name,
      result.military_number,
      formatDateToArabic(result.updatedAt),
    ];
  } else {
    data = [
      result.rank,
      result.name,
      result.military_number,
      result.detachment,
      formatDateToArabic(result.updatedAt),
    ];
  }

  return data.map((item, index) => <label key={index}>{item}</label>);
};
