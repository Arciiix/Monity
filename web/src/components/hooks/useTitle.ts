import { useEffect } from "react";

const useTitle = () => {
  const changeTitle = (newTitle: string): void => {
    document.title = newTitle.length <= 0 ? "Monity" : newTitle + " - Monity";
  };

  useEffect(() => {
    return () => {
      changeTitle("");
    };
  }, []);

  return changeTitle;
};
export default useTitle;
