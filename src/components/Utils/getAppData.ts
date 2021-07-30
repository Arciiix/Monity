import { IAccountSimplified } from "../App/components/Account";
import errorToast from "./errorToast";

async function getSimplifiedAccounts(): Promise<{
  error: boolean;
  data?: IAccountSimplified[];
}> {
  let request = await fetch(`/api/account/getSimplifiedAccounts`);

  if (request.status !== 200) {
    errorToast(
      `Unexpected error (getSimplifiedAccounts) - ${await request.text()} WITH STATUS ${
        request.status
      }`,
      true
    );
    return { error: true };
  } else {
    let response = await request.json();
    return { error: false, data: response.data };
  }
}

export { getSimplifiedAccounts };
