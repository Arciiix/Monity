import { Delete, Star } from "@mui/icons-material";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import IPerson from "../../types/person/person.interface";
import PersonCategories from "../../types/person/personCategories.enum";
import PersonIcon from "./PersonIcon";

interface IPersonListItemProps {
  person: IPerson;
  handleDeletePerson: (person: IPerson) => Promise<void>;
  handleToggleFavorite: (person: IPerson) => Promise<void>;
  handleEditPerson: (person: IPerson) => void;
}

const PersonListItem = ({
  person,
  handleDeletePerson,
  handleToggleFavorite,
  handleEditPerson,
}: IPersonListItemProps) => {
  return (
    <ListItem
      key={person.name}
      secondaryAction={
        <div className="flex gap-2">
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleDeletePerson(person)}
          >
            <Delete />
          </IconButton>
          <IconButton onClick={() => handleToggleFavorite(person)}>
            <Star color={person.isFavorite ? "primary" : "inherit"} />
          </IconButton>
        </div>
      }
    >
      <ListItemButton onClick={() => handleEditPerson(person)}>
        <ListItemIcon>
          <PersonIcon
            category={
              PersonCategories[person.category] as unknown as PersonCategories
            }
          />
        </ListItemIcon>
        <ListItemText
          primary={person.name}
          secondary={person.notes}
        ></ListItemText>
      </ListItemButton>
    </ListItem>
  );
};
export default PersonListItem;
