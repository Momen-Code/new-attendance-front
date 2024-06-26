import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Table } from "../../components";
import { formatDateToArabic } from "../../helpers";
import { useAppContext } from "../../provider";
//Styles
import "./style.scss";

const Dashboard = () => {
  const { setIsLoading, createNotification } = useAppContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [statistics, setStatistics] = useState({
    date: null,
    total_newComers_in_camp: 0,
    total_newComers_out_camp: 0,
  });
  const [filters, setFilters] = useState({
    rank: "",
    name: "",
    military_number: "",
    national_number: "",
    last_update_date: "",
    status: "",
    date: new Date().toISOString(),
  });
  const [index, setIndex] = useState(1);
  const [endpoint, setEndPoint] = useState(
    "http://localhost:5000/dashboard/newComers/bulk"
  );

  const columns = useMemo(() => {
    const columns = [
      { title: "المسلسل", selector: (row, index) => `${index + 1}` },
      { title: "الرتبة/الدرجة", selector: (row) => row.user.rank ?? "ـــ" },
      { title: "الاسم", selector: (row) => row.user.name ?? "ـــ" },
      {
        title: "الرقم العسكري",
        selector: (row) => row.user.military_number ?? "ـــ",
      },
      {
        title: "التاريخ",
        selector: (row) => formatDateToArabic(row.updatedAt) ?? "ـــ",
      },
      {
        title: "الحالة",
        selector: (row) => (
          <div className={`statusContainer ${row.status}`}>
            {(row.status === "in" ? "داخل" : "خارج") ?? "ـــ"}
          </div>
        ),
      },
      {
        title: "محذوف؟",
        selector: (row) => (row.user.is_deleted ? "نعم" : "لا"),
      },
    ];

    return columns;
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(
        `http://localhost:5000/dashboard/newComers/statistics`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (result.data.success) {
        const { date, total_newComers_in_camp, total_newComers_out_camp } =
          result.data.data;
        setStatistics({
          date,
          total_newComers_in_camp,
          total_newComers_out_camp,
        });
        createNotification("تم جلب البيانات بنجاح", "success");
      } else {
        createNotification("لا يوجد بيانات", "warning");
      }
    } catch (error) {
      createNotification(error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFileUpload = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      let res;
      res = await axios.post(`${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (res.data.message) {
        createNotification("تم استيراد البيانات بنجاح", "success");
        setSelectedFile(null);
      } else {
        createNotification("حدث خطأ اثناء استيراد البيانات", "error");
      }
    } catch (error) {
      console.log(error);
      createNotification(error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="dashboardContainer">
        <div className="headerStat">
          <div>
            <div>{formatDateToArabic(new Date(statistics.date))}</div>
            {/* <div>{statistics.date}</div> */}
            <div>
              {statistics.total_newComers_in_camp}
              <span>عدد المستجدين داخل المركز</span>
            </div>
            <div>
              {statistics.total_newComers_out_camp}
              <span>عدد المستجدين خارج المركز</span>
            </div>
          </div>
          <Link to="users">عرض البيانات</Link>
        </div>
      </div>
      <div className="filtersContainer">
        <div>
          <label>التاريخ</label>
          <br />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
        <>
          <div>
            <label>الرقم العسكري</label>
            <br />
            <input
              type="number"
              value={filters.military_number}
              onChange={(e) =>
                setFilters({ ...filters, military_number: e.target.value })
              }
            />
          </div>
          <div>
            <label>الاسم</label>
            <br />
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
        </>

        <div>
          <label>الحالة</label>
          <br />
          <div className="selectContainer">
            <select
              id="selectBox6"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="" disabled selected>
                اختر الحالة
              </option>
              <option value="">الكل</option>
              <option value="out">خارج</option>
              <option value="in">داخل</option>
            </select>
          </div>
        </div>
      </div>
      <div className="tabsContainer">
        {["المستجدين"].map((tab, tabIndex) => (
          <div
            key={tabIndex}
            className={`tab ${index === tabIndex + 1 ? "active" : ""}`}
            onClick={() => {
              setIndex(tabIndex + 1);
              setFilters({
                rank: "",
                name: "",
                military_number: "",
              });
              setEndPoint(
                [
                  "http://localhost:5000/dashboard/newComers/bulk",
                  "http://localhost:5000/dashboard/soldiers/bulk",
                  "http://localhost:5000/dashboard/officers/bulk",
                ][tabIndex]
              );
            }}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="importButton">
        <label className="custom-file-input">
          <input
            type="file"
            accept=".xlsx, .csv"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {selectedFile ? selectedFile.name : "استيراد ملف"}
        </label>
        {selectedFile && <button onClick={handleFileUpload}>استيراد</button>}
      </div>
      <Table
        columns={columns}
        keyValue={"attendance"}
        filters={filters}
        endPoint={"http://localhost:5000/dashboard/attendance"}
        type={""}
        selectedFile={selectedFile}
        isAttendance={true}
      />
    </Layout>
  );
};

export default Dashboard;
