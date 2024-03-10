import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactComponent as Send } from "../../assets/images/send.svg";
import { Layout } from "../../components";
import { formatDateToArabic } from "../../helpers";
import { useAppContext } from "../../provider";

//Styles
import "./style.scss";

const Camera = () => {
  const { status } = useParams();
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [viewResult, setViewResult] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [captured, setCaptured] = useState(false);
  const [militaryNumber, setMilitaryNumber] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const { createNotification, setIsLoading } = useAppContext();

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = stream.getVideoTracks()[0];

      const videoElement = document.getElementById("video");
      videoElement.srcObject = new MediaStream([videoTrack]);
      videoElement.autoplay = true;

      const imageCapture = new ImageCapture(videoTrack);

      const captureButton = document.getElementById("button");

      captureButton.addEventListener("click", async () => {
        const blob = await imageCapture.takePhoto();
        const imgUrl = await blobToDataURL(blob);
        const imgUrlSent = convertBlobToFile(blob, "image.jpg");

        setImage(imgUrlSent);
        setImageUrl(imgUrl);
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const openCameraR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = stream.getVideoTracks()[0];

      const videoElement = document.getElementById("video2");
      videoElement.srcObject = new MediaStream([videoTrack]);
      videoElement.autoplay = true;

      const imageCapture = new ImageCapture(videoTrack);

      const captureCount = 50; // Set the number of images to capture
      let capturedCount = 0;

      const captureImages = async () => {
        setIsLoading(true);
        const blob = await imageCapture.takePhoto();
        const imgUrl = convertBlobToFile(
          blob,
          `${capturedCount}_${militaryNumber}.jpg`
        );
        setFiles((prev) => [...prev, imgUrl]);
        capturedCount += 1;
        if (capturedCount === captureCount) {
          clearInterval(captureIntervalId);
          setCaptured(true);
        }
      };

      const captureInterval = 250;
      const captureIntervalId = setInterval(captureImages, captureInterval);
    } catch (error) {
      console.error("Error accessing camera:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const blobToDataURL = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      // Convert the Blob to data URL with 'image/jpeg' MIME type
      reader.readAsDataURL(blob);
    });
  };

  const convertBlobToFile = (blob, fileName) => {
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  const handleRecognition = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        "http://localhost:5000/face-recognition/recognition",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setResult(result.soldier_data);
        setViewResult(true);
        createNotification("تم استرجاع البيانات بنجاح", "success");
      } else {
        createNotification("لم يتم التعرف علي الوجه", "error");
        setImage(null);
        openCamera();
      }
    } catch (error) {
      createNotification(error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      console.log("files", files);
      const formData = new FormData();

      files.forEach((img, index) => {
        formData.append("images", img);
      });

      formData.append("military_number", militaryNumber);

      if (militaryNumber > 0) {
        const response = await fetch(
          "http://localhost:5000/face-recognition/registration",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          setMilitaryNumber(null);
          createNotification("تم تسجيل البيانات بنجاح", "success");
          setIsRegister(false);
          setFiles([]);
          setCaptured(false);
        } else {
          setMilitaryNumber(null);
          createNotification("لم يتم التعرف علي الوجه", "error");
          setIsRegister(false);
          setCaptured(false);
          setFiles([]);
        }
      }
    } catch (error) {
      createNotification(error.message || "حدث خطأ غير متوقع", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:5000/soldiers/check-${status}`,
        result
      );

      if (res.status === 200 && res.data.message) {
        createNotification("تم الحفظ بنجاح", "success");
        openCamera();
        setImage(null);
        setImageUrl(null);
        setViewResult(false);
      } else if (res.status === 200 && res.data.error) {
        createNotification(res.data.error, "error");
        setViewResult(false);
        handleReset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setImage(null);
    setImageUrl(null);
    setViewResult(false);
    await openCamera();
  };

  useEffect(() => {
    if (isRegister) {
      openCameraR();
    } else {
      openCamera();
    }
  }, [isRegister]);

  useEffect(() => {
    if (captured) {
      handleRegister();
    } else {
      return;
    }
  }, [captured]);

  return (
    <Layout>
      <div className="cameraContainer">
        <div className="titleContainer">
          <h3>{isRegister ? "تسجيل صور " : "التقاط صورة"}</h3>
          {!isRegister && (
            <button onClick={() => setIsRegister(true)}>تسجيل</button>
          )}
        </div>
        <div className="container">
          {!isRegister && (
            <>
              {!viewResult ? (
                <>
                  {image && (
                    <div
                      className={`imgContainer ${
                        status === "in" ? "in" : "out"
                      }`}
                    >
                      <img src={imageUrl} alt="camera" />
                    </div>
                  )}
                  {!image && (
                    <video id="video" width="320" height="240"></video>
                  )}
                  <div className="btnContainer">
                    <button id="button">التقاط صورة</button>
                  </div>
                  {image && (
                    <button onClick={handleRecognition}>
                      <Send />
                    </button>
                  )}
                </>
              ) : (
                <div className="resultsContainer">
                  <div className="container">
                    <div>{renderResultLabels()}</div>
                    <div className="dataC">{renderResultData(result)}</div>
                  </div>
                  <div className="btnContainer">
                    <button onClick={handleSave}>حفظ</button>
                    <button onClick={handleReset}>اعادة</button>
                  </div>
                </div>
              )}
            </>
          )}
          {isRegister && (
            <>
              <input
                type="text"
                value={militaryNumber}
                placeholder="ادخل الرقم العسكري"
                onChange={(e) => setMilitaryNumber(e.target.value)}
              />
              <button onClick={() => openCameraR()}>التقاط صور</button>
              {militaryNumber > 0 && (
                <video id="video2" width="320" height="240"></video>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Camera;

const renderResultLabels = () => {
  const labels = ["الرتبة", "الاسم", "الرقم العسكري", "الوقت"];
  return labels.map((label, index) => <label key={index}>{label}</label>);
};

const renderResultData = (result) => {
  const data = [
    result.rank,
    result.name,
    result.military_number,
    formatDateToArabic(result.last_update_time),
  ];
  return data.map((item, index) => <label key={index}>{item}</label>);
};
