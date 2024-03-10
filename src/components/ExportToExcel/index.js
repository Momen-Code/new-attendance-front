import React from "react";
import * as XLSX from "xlsx";
import { formatDateToArabic } from "../../helpers";

const ExportToExcelButton = ({ data, filename, type, isAttendance }) => {
  const headerTranslationsSoldiers = {
    name: "الاسم",
    rank: "الرتبة",
    military_number: "الرقم العسكري",
    national_number: "الرقم القومي",
  };
  const headerTranslationsVehicles = {
    license_plate_number: "رقم اللوحة",
    highest_rank_name: "اسم اعلي رتبة",
    driver_name: "اسم السائق",
    head_count: "عدد الركاب",
  };
  const headerTranslationsVisitors = {
    name: "الاسم",
    military_number: "الرقم العسكري",
    rank: "الرتبة",
    national_number: "الرقم القومي",
  };
  let headerTranslations = {
    last_update_time: "تاريخ آخر تحديث",
    status: "الحالة",
  };

  if (type === "soldiers") {
    headerTranslations = {
      ...headerTranslationsSoldiers,
      ...headerTranslations,
    };
  } else if (type === "vehicles") {
    headerTranslations = {
      ...headerTranslationsVehicles,
      ...headerTranslations,
    };
  } else if (type === "visitors") {
    headerTranslations = {
      ...headerTranslationsVisitors,
      ...headerTranslations,
    };
  }

  const exportToExcel = () => {
    const translatedData = data.map((item) => {
      const columnOrder =
        type !== "vehicles"
          ? [
              "last_update_time",
              "status",
              "national_number",
              "military_number",
              "name",
              "rank",
            ]
          : type === "soldiers"
          ? ["last_update_time", "status", "military_number", "name", "rank"]
          : isAttendance
          ? [
              "last_update_time",
              "status",
              "head_count",
              "driver_name",
              "highest_rank_name",
              "license_plate_number",
            ]
          : ["last_update_time", "status", "license_plate_number"];
      const translatedItem = {};
      columnOrder.forEach((key) => {
        if (key === "status") {
          translatedItem[headerTranslations[key]] =
            item[key] === "in" ? "داخل" : "خارج";
          return;
        }
        if (key === "last_update_time") {
          translatedItem[headerTranslations[key]] = formatDateToArabic(
            item[key]
          );
          return;
        }
        if (type === "soldiers" && key === "national_number") {
          return;
        } else {
          translatedItem[headerTranslations[key]] = item[key];
        }
      });
      return translatedItem;
    });

    // Create worksheet with translated headers
    const ws = XLSX.utils.json_to_sheet(translatedData);

    // Create workbook and add the translated sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Trigger download with the specified filename
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return <button onClick={exportToExcel}>تصدير إلى Excel</button>;
};

export default ExportToExcelButton;
