import { ReactNode } from "react";

//It describes the route menu options in drawer
interface IRoute {
  name: string; //Used by router mapping to highlight current route
  displayName: string;
  icon: ReactNode;
}
export default IRoute;
