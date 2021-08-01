import { useState } from "react";
import {
  Button,
  FormControl,
  TextField,
  Container,
  Toolbar,
} from "@material-ui/core";
import { HexColorPicker } from "react-colorful";
import styles from "./AccountForm.module.css";
import { valueToString } from "../../../Utils/valueToString";

interface IAccountFormProps {
  isEdit?: boolean;
  nameError?: string;
  valueError?: string;
  colorError?: string;
  onSubmitClick: (name: string, color: string, initialValue?: number) => void;
}

function AccountForm({
  isEdit = false,
  nameError,
  valueError,
  colorError,
  onSubmitClick,
}: IAccountFormProps) {
  let [name, setName] = useState("");
  let [initialValue, setInitialValue] = useState("");
  let [color, setColor] = useState("#32a852");
  let [tempColor, setTempColor] = useState("");
  let [tempColorError, setTempColorError] = useState(false);

  const presetColors = ["#32a852", "#4287f5", "#eb4034", "#c49003"];

  const handleNameChange = (e: any): void => {
    if (e.target.value.length > 64) return;
    setName(e.target.value);
  };

  const handleInitialValueChange = (e: any): void => {
    const valueRegExp = /^\d*(\d+[\.,]{1}\d{0,2})?$/;

    if (!valueRegExp.test(e.target.value)) return;
    setInitialValue(e.target.value);
  };

  const handleColorChange = (newColor: string): void => {
    setColor(newColor);
  };

  const handleTempColorChange = (e: any): void => {
    setTempColor(e.target.value);
  };

  const handleManualColorClick = (): void => {
    let colorRegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    if (!colorRegExp.test(tempColor)) {
      setTempColorError(true);
    } else {
      setTempColorError(false);
      setColor(tempColor);
      setTempColor("");
    }
  };

  const handleSubmitClick = (): void => {
    onSubmitClick(
      name,
      color,
      parseFloat(initialValue.replace(",", ".")) * 100 || 0
    );
  };

  return (
    <Container>
      <Toolbar />
      <FormControl className={styles.formControl}>
        <TextField
          className={styles.input}
          required
          label="Nazwa"
          variant="filled"
          value={name}
          onChange={handleNameChange}
          error={Boolean(nameError)}
          helperText={nameError}
        />
        {!isEdit && (
          <TextField
            className={styles.input}
            label="Początkowa kwota [zł]"
            variant="filled"
            value={initialValue}
            onChange={handleInitialValueChange}
            error={Boolean(valueError)}
            helperText={valueError}
          />
        )}
        <HexColorPicker
          className={styles.colorPicker}
          color={color}
          onChange={handleColorChange}
        />
        <span
          className={styles.colorText}
          style={{ color: colorError ? "#f44336" : "#ffffff" }}
        >
          {color}
          {colorError && <span>{colorError}</span>}
        </span>
        <div className={styles.pickerPresetColors}>
          {presetColors.map((e) => (
            <button
              key={e}
              className={styles.pickerPresetColor}
              style={{ backgroundColor: e }}
              onClick={() => handleColorChange(e)}
            ></button>
          ))}
        </div>
        <div className={styles.manualColorSetWrapper}>
          <TextField
            label="Kolor"
            placeholder={presetColors[0]}
            value={tempColor}
            onChange={handleTempColorChange}
            error={tempColorError}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleManualColorClick}
          >
            Ustaw
          </Button>
        </div>

        <div
          className={styles.accountPreview}
          style={{ backgroundColor: color }}
        >
          <span className={styles.accountName}>{name || "Nazwa konta"}</span>
          <span className={styles.accountInitialValue}>
            {valueToString(
              parseFloat(initialValue.replace(",", ".")) * 100 || 0
            )}
          </span>
        </div>
        <Button
          className={styles.submit}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmitClick}
        >
          Zapisz
        </Button>
      </FormControl>
    </Container>
  );
}

export default AccountForm;
