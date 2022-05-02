import Backdrop from "@mui/material/Backdrop";
import Loading, { ILoadingProps } from "../Loading/Loading";

type ILoadingScreenProps = ILoadingProps & {
  isLoading: boolean;
};

function LoadingOverlay(props: ILoadingScreenProps) {
  return (
    <Backdrop open={props.isLoading}>
      <Loading {...props} />
    </Backdrop>
  );
}

export default LoadingOverlay;
