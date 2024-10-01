export const findLabelByValue = (data, value) => {
  const element = data.find((el) => el.value === value);
  return element ? element.label : null;
};

export const statusList = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Inactive",
    value: "Inactive",
  },
  {
    label: "Active",
    value: "Active",
  },
];
