//If any of the values of the object is not null, returns true. Otherwise returns false
const checkForNotNullValues = <T>(obj: T): boolean => {
  if (Object.values(obj).some((elem) => !!elem)) {
    return true;
  } else {
    return false;
  }
};
export default checkForNotNullValues;
