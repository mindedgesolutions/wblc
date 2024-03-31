import date from "date-and-time";

export const dateFormat = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "DD-MM-YYYY");
};

export const dateFormatFancy = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "ddd, MMM DD YYYY");
};

export const datePickerFormat = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "YYYY-MM-DD");
};

export const genderFormat = (value) => {
  let label;
  switch (value) {
    case "M":
      label = "Male";
      break;
    case "F":
      label = "Female";
      break;
    case "O":
      label = "Other";
      break;
  }
  return label;
};

export const serialNo = (page) => {
  const slNo = Number(page) === 1 || !page ? 1 : (Number(page) - 1) * 10 + 1;
  return slNo;
};

export const shortDesc = (desc) => {
  const shortDesc = desc
    ? desc.length > 20
      ? desc.slice(0, 20) + " ..."
      : desc
    : `NA`;
  return shortDesc;
};
