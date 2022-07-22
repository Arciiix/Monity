import {
  Box,
  Checkbox,
  Fab,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useId, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import useAppBarContent from "../../hooks/useAppBarContent";
import validator from "validator";
import checkForNotNullValues from "../../utils/checkForNotNullValues";
import { Save } from "@mui/icons-material";
import { AxiosErr, fetch, isAxiosErr } from "../../utils/axios";
import LoadingOverlay from "../../Loading/LoadingOverlay/LoadingOverlay";
import useInfoDialog from "../../hooks/useInfoDialog";
import InfoDialogTypes from "../../../types/infoDialog/infoDialogTypes.enum";
import { useNavigate, useParams } from "react-router-dom";
import useData from "../../hooks/useData";
import PersonIcon from "../PersonIcon";
import PersonCategories from "../../../types/person/personCategories.enum";
import IPerson from "../../../types/person/person.interface";
import { basicNameRegexp } from "../../utils/regExps";
import { basicNameAllowedCharacters } from "../../utils/validationErrorMessages";

interface IPersonFormHeaderProps {
  person?: IPerson | null;
}
interface IPersonFormErrors {
  name?: string | null;
  notes?: string | null;
  category?: string | null;
}

const PersonFormHeader = ({ person }: IPersonFormHeaderProps) => {
  return (
    <div className="flex flex-row items-center gap-3">
      {person?.category ? (
        <PersonIcon
          category={
            PersonCategories[person.category] as unknown as PersonCategories
          }
        />
      ) : (
        <FaUserPlus size={32} />
      )}
      <span className="text-2xl">
        {person ? `Edit ${person.name}` : "Add person"}
      </span>
    </div>
  );
};

const PersonForm = () => {
  const appBarContent = useAppBarContent();
  const { addToInfoDialogs, displayUnknownErrorDialog } = useInfoDialog();
  const navigate = useNavigate();
  const { fetchPeople } = useData();
  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [oldPerson, setOldPerson] = useState<IPerson | null>(null);

  const [name, setName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [category, setCategory] = useState<PersonCategories>(
    PersonCategories.other
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const categorySelectId = useId();

  const [errors, setErrors] = useState<IPersonFormErrors>({});

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(
      (Object.keys(PersonCategories)[
        parseInt(event.target.value as string)
      ] as PersonCategories) || PersonCategories.other
    );
  };
  const handleIsFavoriteChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsFavorite(event.target.checked);
  };

  const validate = (): boolean => {
    const errors: IPersonFormErrors = {};
    if (
      !validator.isLength(name, {
        min: 3,
        max: 128,
      }) ||
      !validator.matches(name, basicNameRegexp)
    ) {
      errors.name = `Name can be from 3 to 128 characters long and contain ${basicNameAllowedCharacters}`;
    }

    if (
      notes &&
      (!validator.isLength(notes, {
        min: 0,
        max: 1024,
      }) ||
        !validator.matches(notes, basicNameRegexp))
    ) {
      errors.notes = `Notes can be up to 1024 characters long and contain ${basicNameAllowedCharacters}`;
    }

    if (!Object.values(PersonCategories).includes(category)) {
      errors.category = "Wrong category";
    }

    setErrors(errors);
    return !checkForNotNullValues(errors); //If there's any not-null value (error) in the errors, return false (not validated); otherwise return true
  };

  const navigateToManagePeople = () => {
    navigate("/app/manage/people");
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    const newPerson: IPerson = {
      id: id,
      name,
      notes: notes ?? "",
      category,
      isFavorite,
    };

    setIsLoading(true);
    try {
      await fetch("/v1/person", {
        method: isEditing ? "PUT" : "POST",
        data: newPerson,
      });
    } catch (err: AxiosErr) {
      const error = isAxiosErr(err);
      if (error) {
        switch (error.statusCode) {
          case 404:
            //Person not found
            addToInfoDialogs({
              type: InfoDialogTypes.error,
              title: "Not found",
              message: "This person couldn't be found!",
            });
            break;
          default:
            console.error(error);
            displayUnknownErrorDialog();
        }
      } else {
        console.error(err);
        displayUnknownErrorDialog();
      }
      setIsLoading(false);

      return null;
    }

    await fetchPeople();
    setIsLoading(false);

    navigateToManagePeople();
  };

  const fetchOldPerson = async (id: string) => {
    try {
      const person = await fetch.get(`/v1/person/${id}`);
      const personData = person.data as IPerson;

      setName(personData.name);
      setNotes(personData.notes);
      setCategory(personData.category);
      setIsFavorite(personData.isFavorite);

      setOldPerson(personData);
      appBarContent(<PersonFormHeader person={personData} />);
    } catch (err: AxiosErr) {
      const error = isAxiosErr(err);
      console.error(error);
      console.error(err);
      navigateToManagePeople();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setIsEditing(true);
      fetchOldPerson(id);
    }

    appBarContent(<PersonFormHeader person={null} />);
    return () => {
      appBarContent(null);
    };
  }, []);

  return (
    <Box className="flex flex-col w-full gap-4">
      <LoadingOverlay isLoading={isLoading} />

      <TextField
        onChange={handleNameChange}
        value={name}
        label="Name"
        placeholder="John Doe"
        inputProps={{ maxLength: 128 }}
        required
        error={!!errors.name}
        helperText={errors.name || ""}
      />

      <TextField
        onChange={handleNotesChange}
        multiline
        value={notes}
        label="Notes"
        placeholder="That guy from school"
        inputProps={{ maxLength: 1024 }}
        error={!!errors.notes}
        helperText={errors.notes || ""}
      />

      <FormControl error={!!errors.category}>
        <InputLabel id={categorySelectId}>Category related to them</InputLabel>
        <Select
          labelId={categorySelectId}
          value={Object.keys(PersonCategories)
            .indexOf(category.toString())
            .toString()}
          label="Category related to them"
          onChange={handleCategoryChange}
          classes={{
            select: "flex gap-2 items-center",
          }}
        >
          {Object.values(PersonCategories)
            .filter((e) => isNaN(Number(e))) /* Get the enum values only */
            .map((e, index) => (
              <MenuItem value={index} className="flex gap-2">
                <PersonIcon
                  category={e as PersonCategories}
                  zeroPadding
                  bgSize={"32px"}
                  iconSize={18}
                />
                {e.charAt(0).toUpperCase() + e.slice(1)}
                {/* Capitalize the first letter */}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>{errors.category}</FormHelperText>
      </FormControl>
      <FormControl>
        <FormControlLabel
          className="select-none" /* To disable user text selection */
          control={
            <Checkbox value={isFavorite} onChange={handleIsFavoriteChange} />
          }
          label="Add to favorites ✨"
        />
      </FormControl>

      <Fab
        color="primary"
        className="fixed bottom-4 right-4"
        onClick={handleSave}
      >
        <Save />
      </Fab>
    </Box>
  );
};
export default PersonForm;
