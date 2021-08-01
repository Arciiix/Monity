import { useEffect } from "react";
import { setTitle } from "../../../Utils/setTitle";
import AccountForm from "../AccountForm/AccountForm";

function AddAccount() {
  const handleSubmitClick = (
    name: string,
    color: string,
    initialValue?: number
  ): void => {
    //DEV
    //TODO: Create the account with the following data
    console.log(`DEV/CREATE_ACCOUNT/${name}/${initialValue}/${color}`);
  };

  useEffect(() => {
    setTitle("dodaj konto");
  }, []);
  return (
    <>
      <AccountForm onSubmitClick={handleSubmitClick} />
    </>
  );
}

export default AddAccount;
