import axios from "axios";
import React, { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useAppContext } from "../../provider";
import ExportToExcelButton from "../ExportToExcel";

//Styles
import "./style.scss";

const Table = ({
  columns,
  keyValue,
  filters,
  endPoint,
  type,
  visible,
  selectedFile,
  isAttendance,
  path = "/",
}) => {
  const { setIsLoading, isLoading } = useAppContext();
  const { data, refetch } = useInfiniteQuery([keyValue, 1], async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(endPoint, {
        params: {
          ...filters,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setIsLoading(false);
      console.log(result.data);
      return result.data.data;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (!data) {
      refetch();
    }
  });

  useEffect(() => {
    refetch();
  }, [filters, endPoint, visible, selectedFile]);

  return (
    <>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.pages?.map((page) =>
              page?.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => {
                    return (
                      <td key={column.title}>{column.selector(row, index)}</td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {(!data?.pages || data?.pages[0]?.length == 0) && (
          <div style={{ textAlign: "center", margin: "4px 0px" }}>
            لا توجد بيانات
          </div>
        )}
      </div>
      <ExportToExcelButton
        data={data?.pages[0]}
        filename={path === "/" ? "تمام الحضور والانصراف" : "البيانات"}
        type={type}
        isAttendance={isAttendance}
      />
    </>
  );
};

export default Table;
