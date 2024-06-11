import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useAppContext } from "../../provider";
import ExportToExcelButton from "../ExportToExcel";
import InfinitScroll from "react-infinite-scroll-component";
import PropagateLoader from "react-spinners/PropagateLoader";

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
  const [numberOfRecords, setNumberOfRecords] = useState(0);
  const scrollableRef = useRef(null);
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading: loading,
  } = useInfiniteQuery(
    [keyValue, 1],
    async ({ pageParam = 1 }) => {
      try {
        setIsLoading(true);
        const result = await axios.get(endPoint, {
          params: {
            ...filters,
            page: pageParam,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setNumberOfRecords(result.data.numberOfRecords);
        setIsLoading(false);
        return result.data.data;
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    },
    {
      keepPreviousData: true,
      enabled: true,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < 10) {
          return undefined;
        } else {
          const prev = pages.reduce((acc, curr) => [...acc, ...curr]);
          if (prev.length === numberOfRecords) {
            return undefined;
          } else {
            return pages?.length + 1;
          }
        }
      },
    }
  );
  const finalData = data?.pages?.reduce((acc, curr) => [...acc, ...curr], []);

  useEffect(() => {
    if (!data) {
      refetch();
    }
  });

  useEffect(() => {
    if (finalData?.length <= 10) {
      refetch();
    }
  }, [filters, endPoint, visible, selectedFile]);

  if (loading) {
    return (
      <div className="loading-container">
        <PropagateLoader size={16} color="#4397df" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <h1>حدث خطأ اثناء تحميل البيانات</h1>
      </div>
    );
  }

  return (
    <>
      {!isAttendance && <div className="count">العدد:{numberOfRecords}</div>}
      <div className="tableContainer" ref={scrollableRef} id="scrollableDiv">
        <InfinitScroll
          dataLength={finalData?.length}
          next={fetchNextPage}
          scrollableTarget="scrollableDiv"
          hasMore={hasNextPage}
          loader={<PropagateLoader size={16} color="#4397df" />}
          endMessage={
            finalData?.length != 0 ? (
              <div className="loading-container">نهاية البيانات</div>
            ) : (
              <div className="loading-container">لا يوجد سجلات</div>
            )
          }
        >
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finalData?.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => {
                    return (
                      <td key={column.title}>{column.selector(row, index)}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </InfinitScroll>
      </div>
      <ExportToExcelButton
        data={async () => {
          try {
            setIsLoading(true);
            const result = await axios.get(endPoint, {
              params: {
                ...filters,
                paginate: false,
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            });
            setIsLoading(false);
            return result.data.data;
          } catch (error) {
            console.log(error);
            setIsLoading(false);
          }
        }}
        filename={path === "/" ? "تمام الحضور والانصراف" : "البيانات"}
        type={type}
        isUsers={!isAttendance}
        userType={type}
      />
    </>
  );
};

export default Table;
