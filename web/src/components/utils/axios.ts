import axios, { AxiosError } from "axios";

type AxiosErr = AxiosError | any;

function isAxiosErr(err: AxiosErr):
  | false
  | {
      statusCode: number;
      response: any;
    } {
  if (axios.isAxiosError(err) && err.response) {
    return {
      statusCode: err.response.status,
      response: err.response.data,
    };
  } else {
    return false;
  }
}

axios.defaults.withCredentials = true;
const fetch = axios.create();
function createRefreshTokenInterceptor() {
  const interceptor = fetch.interceptors.response.use(
    (response) => response,
    async (err) => {
      //Skip common errors except for 401 Unauthenticated
      if (err.response.status !== 401) {
        return Promise.reject(err);
      }

      //Don't make the loop - if the refresh token request gives 401
      fetch.interceptors.response.eject(interceptor);

      try {
        await axios.post("/v1/auth/refreshToken");
        createRefreshTokenInterceptor();
        console.log("Refreshed the token...");
        return fetch(err.response.config);
      } catch (error: any) {
        createRefreshTokenInterceptor();
        console.log("Didn't get the token - reload window...");
        if (!err.response.config?.dontReload) {
          window.location.reload();
        }
        return Promise.reject(error);
      }
    }
  );
}
createRefreshTokenInterceptor();

export type { AxiosErr };
export { isAxiosErr, fetch };
