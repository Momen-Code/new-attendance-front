import React from "react";
import * as XLSX from "xlsx";
import { formatDateToArabic } from "../../helpers";

const ExportToExcelButton = ({ data, filename }) => {
  let headerTranslations = {
    rank: "الرتبة",
    name: "الاسم",
    military_number: "الرقم العسكري",
    updatedAt: "تاريخ آخر تحديث",
    status: "الحالة",
  };

  const exportToExcel = () => {
    const translatedData = data.map((item) => {
      const columnOrder = [
        "rank",
        "name",
        "military_number",
        "updatedAt",
        "status",
      ];

      const translatedItem = {};
      columnOrder.forEach((key) => {
        if (key === "name" || key === "rank" || key === "military_number") {
          translatedItem[headerTranslations[key]] = item.user[key];
          return;
        }
        if (key === "status") {
          translatedItem[headerTranslations[key]] =
            item[key] === "in" ? "داخل" : "خارج";
          return;
        }
        if (key === "updatedAt") {
          translatedItem[headerTranslations[key]] = formatDateToArabic(
            item[key]
          );
          return;
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
