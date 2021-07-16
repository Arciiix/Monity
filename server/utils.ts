/**
 *@name Constants
  @description If you want to specify your constants in a file, follow the schema below:
 *@param {string} jwtSecretAccess
 *@param {string} jwtSecretRefersh
 */

import constantsFile from "./constants";

//If user has specified the constants in env, set them first. Otherwise, set the ones from the file
const jwtSecretAccess =
  process.env.jwtSecretAccess || constantsFile.jwtSecretAccess;
const jwtSecretRefersh =
  process.env.jwtSecretRefersh || constantsFile.jwtSecretRefersh;
const constants = { jwtSecretAccess, jwtSecretRefersh };

/**
 * @name formatDate
 * @description A function used to format a Date object to dd.MM.yyyy HH:mm:ss
 * @param date
 */

function formatDate(date: Date | number | string): string {
  let dateObj = new Date(date);
  if (!dateObj) return "";

  return `${addZero(dateObj.getDate())}.${addZero(
    dateObj.getMonth() + 1
  )}.${dateObj.getFullYear()} ${addZero(dateObj.getHours())}:${addZero(
    dateObj.getMinutes()
  )}:${addZero(dateObj.getSeconds())}`;
}

/**
 * @name addZero
 * @description A function that converts a number to a string and adds "0" before it if it's lower than 10 (e.g. 7 = 07)
 * @param number
 */
function addZero(number: number): string {
  return number < 10 ? `0${number}` : `${number}`;
}

export { formatDate, addZero, constants };
