import { ReactNode } from "react";

//It describes the route menu options in drawer
interface IRoute {
  name: string; //Used by router mapping to highlight current route; for subroutes, use '/' for defining subroutes, for example to define subroute of app, use "app/name"
  displayName: string;
  icon: ReactNode;

  /* For subroutes */
  open?: boolean;
  subroutes?: IRoute[];
}
export default IRoute;
