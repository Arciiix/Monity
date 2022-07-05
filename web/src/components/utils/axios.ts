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

const fetch = axios.create();
function createRefreshTokenInterceptor() {
  const interceptor = fetch.interceptors.response.use(
    (response) => response,
    async (error) => {
      //Skip common errors except for 401 Unauthenticated
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      //Don't make the loop - if the refresh token request gives 401
      fetch.interceptors.response.eject(interceptor);

      try {
        await axios.post("/v1/auth/refreshToken");
        createRefreshTokenInterceptor();
        return fetch(error.response.config);
      } catch (error: any) {
        createRefreshTokenInterceptor();
        window.location.reload();
        return Promise.reject(error);
      }
    }
  );
}
createRefreshTokenInterceptor();

export type { AxiosErr };
export { isAxiosErr, fetch };
