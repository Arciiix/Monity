import { AccountBalanceWallet, Add, Delete, Star } from "@mui/icons-material";
import {
  Button,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FaAddressBook, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { allAccountsState } from "../../../atoms/account/accounts.atom";
import allPeopleState from "../../../atoms/person/allPeople.atom";
import IAccount from "../../../types/account/account.interface";
import AccountIcons from "../../../types/account/accountIcons.enum";
import InfoDialogTypes from "../../../types/infoDialog/infoDialogTypes.enum";
import IPerson from "../../../types/person/person.interface";
import PersonCategories from "../../../types/person/personCategories.enum";
import AccountIcon from "../../Account/AccountIcon";
import { drawerWidth } from "../../Dashboard/Dashboard";
import useAppBarContent from "../../hooks/useAppBarContent";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import useData from "../../hooks/useData";
import useInfoDialog from "../../hooks/useInfoDialog";
import LoadingOverlay from "../../Loading/LoadingOverlay/LoadingOverlay";
import PersonIcon from "../../Person/PersonIcon";
import PersonListItem from "../../Person/PersonListItem";
import { AxiosErr, fetch, isAxiosErr } from "../../utils/axios";
import getFontContrastingColor from "../../utils/getFontContrastingColor";

const ManagePeopleHeader = () => {
  return (
    <div className="flex flex-row items-center gap-3">
      <FaAddressBook size={32} />
      <span className="text-2xl">Manage people</span>
    </div>
  );
};

interface INoPeopleViewProps {
  handleAdd: () => void;
}
const NoPeopleView = ({ handleAdd }: INoPeopleViewProps) => {
  return (
    <div
      className="flex flex-col justify-center items-center h-full gap-3 absolute top-2/4 -translate-x-2/4 -translate-y-2/4"
      style={{
        left: `calc(50% + ${drawerWidth / 2}px`,
      }}
    >
      <span className="text-3xl">No people to display! 👀</span>
      <Button className="text-xl" onClick={handleAdd}>
        <Add />
        Add a new person
      </Button>
    </div>
  );
};

const ManagePeople = () => {
  const { addToInfoDialogs, displayUnknownErrorDialog } = useInfoDialog();
  const navigate = useNavigate();
  const appBarContent = useAppBarContent();
  const confirm = useConfirmDialog();
  const { fetchPeople } = useData();

  const [isLoading, setIsLoading] = useState(false);

  const [allPeople, setAllPeople] = useRecoilState(allPeopleState);

  const handleDeletePerson = async (e: IPerson) => {
    const isConfirmed = await confirm(
      `Do you really want to delete ${e.name}? This action cannot be undone 😱`
    );
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      await fetch.delete(`/v1/person/${e.id}`);
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
    }
    await fetchPeople();
    setIsLoading(false);
  };
  const handleAddPerson = () => {
    navigate("add");
  };
  const handleEditPerson = (person: IPerson) => {
    navigate(`edit/${person.id}`);
  };
  const handleToggleFavorite = async (person: IPerson) => {
    setIsLoading(true);
    try {
      await fetch.put(`/v1/person`, {
        id: person.id,
        isFavorite: !person.isFavorite,
      });

      //Modify the people array without refetching
      const newPerson: IPerson = { ...person, isFavorite: !person.isFavorite };
      const oldIndex = allPeople.findIndex((e) => e.id === person.id);
      setAllPeople((prev) => {
        const next = [...prev];
        next[oldIndex] = newPerson;
        return next;
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
            displayUnknownErrorDialog();
        }
      } else {
        displayUnknownErrorDialog();
      }
      console.error(err);
    }
    setIsLoading(false);
  };

  const renderItems = useMemo((): JSX.Element[] => {
    return [...allPeople]
      .sort(
        (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
      ) /* Favorites first */
      .map((e) => {
        return (
          <PersonListItem
            person={e}
            handleDeletePerson={handleDeletePerson}
            handleToggleFavorite={handleToggleFavorite}
            handleEditPerson={handleEditPerson}
          />
        );
      });
  }, [allPeople]);

  useEffect(() => {
    appBarContent(<ManagePeopleHeader />);

    return () => {
      appBarContent(null);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <LoadingOverlay isLoading={isLoading} />
      {allPeople.length ? (
        <List>{renderItems}</List>
      ) : (
        <NoPeopleView handleAdd={handleAddPerson} />
      )}

      <Tooltip className="fixed bottom-4 right-4" title="Add person">
        <Fab color="primary" aria-label="Add person" onClick={handleAddPerson}>
          <Add />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default ManagePeople;
