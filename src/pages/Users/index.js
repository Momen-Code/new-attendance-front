import React, { useMemo, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { DeleteUser, Layout, Table } from "../../components";

//styles
import "./style.scss";

const Users = () => {
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [endpoint, setEndPoint] = useState(
    "http://localhost:5000/dashboard/newComers"
  );
  const [filters, setFilters] = useState({
    name: "",
    military_number: "",
    detachment: "",
    status: "",
  });
  const [index, setIndex] = useState(1);

  const columns = useMemo(() => {
    const commonColumns = [
      { title: "المسلسل", selector: (row, index) => `${index + 1}` },
    ];

    const soldiersColumns = [
      ...commonColumns,
      { title: "الاسم", selector: (row) => row.name ?? "ـــ" },
      {
        title: "الرقم العسكري",
        selector: (row) => row.military_number ?? "ـــ",
      },
      { title: "الرتبة/الدرجة", selector: (row) => row.rank ?? "ـــ" },
      {
        title: "الحالة",
        selector: (row) => (row.status === "out" ? "خارج" : "داخل"),
      },
      {
        title: "",
        selector: (row) => (
          <div className="actionsContainer">
            <Link
              to={`/${
                index === 1
                  ? "newComers"
                  : index === 2
                  ? "soldiers"
                  : "officers"
              }/edit/${row.military_number}`}
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              <MdEdit size={20} fill="blue" />
            </Link>
            <div>
              <MdDelete
                size={20}
                fill="red"
                onClick={() => {
                  setUserId(row._id);
                  setVisible(true);
                }}
              />
            </div>
          </div>
        ),
      },
    ];

    const officersColumns = [
      ...commonColumns,
      { title: "الاسم", selector: (row) => row.name ?? "ـــ" },
      {
        title: "الرقم العسكري",
        selector: (row) => row.military_number ?? "ـــ",
      },
      { title: "الرتبة/الدرجة", selector: (row) => row.rank ?? "ـــ" },
      {
        title: "الحالة",
        selector: (row) => (row.status === "out" ? "خارج" : "داخل"),
      },
      {
        title: "",
        selector: (row) => (
          <div className="actionsContainer">
            <Link
              to={`/${
                index === 1
                  ? "newComers"
                  : index === 2
                  ? "soldiers"
                  : "officers"
              }/edit/${row.military_number}`}
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              <MdEdit size={20} fill="blue" />
            </Link>
            <div>
              <MdDelete
                size={20}
                fill="red"
                onClick={() => {
                  setUserId(row._id);
                  setVisible(true);
                }}
              />
            </div>
          </div>
        ),
      },
    ];

    const newComersColumns = [
      ...commonColumns,
      { title: "الاسم", selector: (row) => row.name ?? "ـــ" },
      {
        title: "الرقم العسكري",
        selector: (row) => row.military_number ?? "ـــ",
      },
      { title: "الرتبة/الدرجة", selector: (row) => row.rank ?? "ـــ" },
      { title: "الكتيبة", selector: (row) => row.detachment ?? "ـــ" },
      {
        title: "الحالة",
        selector: (row) => (row.status === "out" ? "خارج" : "داخل"),
      },
      {
        title: "",
        selector: (row) => (
          <div className="actionsContainer">
            <Link
              to={`/${
                index === 1
                  ? "newComers"
                  : index === 2
                  ? "soldiers"
                  : "officers"
              }/edit/${row.military_number}`}
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              <MdEdit size={20} fill="blue" />
            </Link>
            <div>
              <MdDelete
                size={20}
                fill="red"
                onClick={() => {
                  setUserId(row._id);
                  setVisible(true);
                }}
              />
            </div>
          </div>
        ),
      },
    ];

    return index === 1
      ? newComersColumns
      : index === 2
      ? soldiersColumns
      : officersColumns;
  }, [index]);

  return (
    <Layout>
      <div className="usersContainer">
        <div className="filtersContainer">
          <>
            <div>
              <label>الرقم العسكري</label>
              <br />
              <input
                type="number"
                value={filters.military_number}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    military_number: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label>الاسم</label>
              <br />
              <input
                type="text"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            </div>
            {index === 1 && (
              <div>
                <label>الكتيبة</label>
                <br />
                <input
                  type="text"
                  value={filters.detachment}
                  onChange={(e) =>
                    setFilters({ ...filters, detachment: e.target.value })
                  }
                />
              </div>
            )}
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
          </>
        </div>
        <div className="tabsContainer">
          {["المستجدين", "القوة الاساسية", "ضباط / صف ضباط"].map(
            (tab, tabIndex) => (
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
                      "http://localhost:5000/dashboard/newComers",
                      "http://localhost:5000/dashboard/soldiers",
                      "http://localhost:5000/dashboard/officers",
                    ][tabIndex]
                  );
                }}
              >
                {tab}
              </div>
            )
          )}
        </div>
      </div>
      <Table
        columns={columns}
        keyValue={index}
        filters={filters}
        endPoint={endpoint}
        type={index === 1 ? "newComers" : index === 2 ? "soldiers" : "officers"}
        visible={visible}
        path="/users"
        isAttendance={false}
      />
      <DeleteUser
        setVisible={setVisible}
        visible={visible}
        id={userId}
        type={index === 1 ? "newComers" : index === 2 ? "soldiers" : "officers"}
      />
    </Layout>
  );
};

export default Users;
