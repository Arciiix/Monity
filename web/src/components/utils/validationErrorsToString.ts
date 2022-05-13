function validationErrorsToString(validationErrors: any): string {
  let validationErrorsString = "";
  for (let key in validationErrors) {
    validationErrorsString += validationErrors[key].join(", ");
    validationErrorsString += "; ";
  }

  return validationErrorsString;
}

export default validationErrorsToString;
