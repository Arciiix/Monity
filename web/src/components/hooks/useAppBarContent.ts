import { useRecoilState } from "recoil";
import overrideAppBarContentState from "../../atoms/header/overrideAppBarContent.atom";

const useAppBarContent = () => {
  const [overrideAppBarContent, setOverrideAppBarContent] = useRecoilState(
    overrideAppBarContentState
  );
  return setOverrideAppBarContent;
};
export default useAppBarContent;
