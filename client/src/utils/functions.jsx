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
