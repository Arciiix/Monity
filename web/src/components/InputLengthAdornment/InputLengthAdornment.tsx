import { grey, red } from "@mui/material/colors";
import InputAdornment from "@mui/material/InputAdornment";

interface IInputLengthAdornmentProps {
  value: string | null;
  maxLength: number;
}

const InputLengthAdornment = ({
  value,
  maxLength,
}: IInputLengthAdornmentProps) => {
  return (
    <InputAdornment position="end">
      <span
        style={{
          color: maxLength - (value ?? "").length < 0 ? red[400] : grey[400],
        }}
      >
        {maxLength - (value ?? "").length}
      </span>
    </InputAdornment>
  );
};
export default InputLengthAdornment;
