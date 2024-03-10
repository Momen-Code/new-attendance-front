export const formatDateToArabic = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  // Parse the input date string
  const date = new Date(dateString);

  // Format the date in Arabic locale
  const formattedDate = new Intl.DateTimeFormat("ar", options).format(date);

  return formattedDate;
};
