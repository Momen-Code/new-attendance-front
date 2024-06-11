import React from "react";
import * as XLSX from "xlsx";
import { formatDateToArabic } from "../../helpers";

const ExportToExcelButton = ({ data, filename, isUsers, userType }) => {
  let headerTranslations;
  if (isUsers && userType === "newComers") {
    headerTranslations = {
      rank: "الرتبة",
      name: "الاسم",
      military_number: "الرقم العسكري",
      detachment: "الكتيبة",
      updatedAt: "تاريخ آخر تحديث",
      status: "الحالة",
    };
  } else {
    headerTranslations = {
      rank: "الرتبة",
      name: "الاسم",
      military_number: "الرقم العسكري",
      updatedAt: "تاريخ آخر تحديث",
      status: "الحالة",
    };
  }

  const exportToExcel = async () => {
    const [res] = await Promise.all([data()]);

    const translatedData = res?.map((item) => {
      let columnOrder;
      if (isUsers && userType === "newComers") {
        columnOrder = [
          "rank",
          "name",
          "military_number",
          "detachment",
          "updatedAt",
          "status",
        ];
      } else {
        columnOrder = [
          "rank",
          "name",
          "military_number",
          "updatedAt",
          "status",
        ];
      }

      const translatedItem = {};
      columnOrder.forEach((key) => {
        if (
          !isUsers &&
          (key === "name" ||
            key === "rank" ||
            key === "military_number" ||
            key === "detachment")
        ) {
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
