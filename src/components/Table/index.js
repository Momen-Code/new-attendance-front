import axios from "axios";
import React, { useEffect, useState } from "react";
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
  const { setIsLoading } = useAppContext();
  const [, setNumberOfPages] = useState(0);
  const { data, refetch } = useInfiniteQuery(
    [keyValue, 1],
    async ({ pageParam = 0 }) => {
      try {
        setIsLoading(true);
        const result = await axios.get(endPoint, {
          params: {
            ...filters,
            skip: pageParam,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setNumberOfPages(result.data.numberOfPages);
        setIsLoading(false);
        return result.data.data;
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    },
    {
      // keepPreviousData: true,
      // enabled: true,
      // getNextPageParam: (lastPage, pages) => {
      //   console.log("sdsd", pages.length);
      //   if (pages.length !== numberOfPages) {
      //     console.log("entered");
      //     return pages.length * 10;
      //   }
      // },
    }
  );
  // const finalData = data?.pages?.reduce((acc, curr) => [...acc, ...curr]);

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
        {/* <InfinitScroll
          dataLength={numberOfPages * 10}
          next={fetchNextPage}
          scrollableTarget="table-container"
          hasMore={hasNextPage}
          // loader={<PropagateLoader size={16} color="#4397df" />}
          endMessage={
            finalData?.length != 0 ? (
              <div className="loading-container">نهاية البيانات</div>
            ) : (
              <div className="loading-container">لا يوجد سجلات</div>
            )
          }
        > */}
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
        {/* </InfinitScroll> */}
      </div>
      <ExportToExcelButton
        data={data?.pages[0]}
        filename={path === "/" ? "تمام الحضور والانصراف" : "البيانات"}
        type={type}
        isUsers={!isAttendance}
        userType={type}
      />
    </>
  );
};

export default Table;
