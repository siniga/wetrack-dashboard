export function compareFromPrevData(current, previous) {
  return ((current - previous) / previous) * 100
    ? ((current - previous) / previous) * 100
    : 0;
}

export function calcPercentage(numA, numB) {
  return (numA / numB) * 100 ? (numA / numB) * 100 : 0;
}

export const generateRandomNumber = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const filterItems = (list,selectedItem) => {
  const filtered = list.filter((item) =>
    item.customer_type.name.toLowerCase().includes(selectedItem.toLowerCase())
  );
 
  return filtered;
};
