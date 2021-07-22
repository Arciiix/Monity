import errorToast from "./errorToast";

interface IUserData {
  id: string;
  login: string;
  email: string;
}

async function authorize(): Promise<IUserData> {
  let request = await fetch(`/api/user/auth`);
  if (request.status !== 200) {
    window.location.href = "/login";
    return { id: "", login: "", email: "" };
  } else {
    let response = await request.json();
    if (response.error) {
      errorToast(
        `Unexpected error - ${JSON.stringify(response)} WITH STATUS ${
          request.status
        }`,
        true
      );
      return { id: "", login: "", email: "" };
    } else {
      return response.data;
    }
  }
}

export { authorize };
export type { IUserData };
