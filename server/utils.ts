function formatDate(date: Date | number | string): string {
  let dateObj = new Date(date);
  if (!dateObj) return "";

  return `${addZero(dateObj.getDate())}.${addZero(
    dateObj.getMonth() + 1
  )}.${dateObj.getFullYear()} ${addZero(dateObj.getHours())}:${addZero(
    dateObj.getMinutes()
  )}:${addZero(dateObj.getSeconds())}`;
}

function addZero(number: number): string {
  return number < 10 ? `0${number}` : `${number}`;
}

export { formatDate, addZero };
