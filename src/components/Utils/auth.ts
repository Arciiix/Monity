import errorToast from "./errorToast";

interface IUserData {
  id: string;
  login: string;
  email: string;
  authorized: boolean;
}

async function authorize(dontRedirect?: boolean): Promise<IUserData> {
  let request = await fetch(`/api/user/auth`);
  if (request.status !== 200) {
    if (!dontRedirect) {
      window.location.href = "/login";
    }
    return { id: "", login: "", email: "", authorized: false };
  } else {
    let response = await request.json();
    if (response.error) {
      errorToast(
        `Unexpected error - ${JSON.stringify(response)} WITH STATUS ${
          request.status
        }`,
        true
      );
      return { id: "", login: "", email: "", authorized: false };
    } else {
      return { ...response.data, authorized: true };
    }
  }
}

async function logOut(): Promise<{ error: boolean }> {
  let request = await fetch(`/api/user/logout`, { method: "DELETE" });

  if (request.status !== 200) {
    errorToast(
      `Unexpected error - ${await request.text()} WITH STATUS ${
        request.status
      }`,
      true
    );
    return { error: true };
  }

  return { error: false };
}

export { authorize, logOut };
export type { IUserData };
