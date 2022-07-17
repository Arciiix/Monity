import { IconButton, List, ListItem, ListItemButton } from "@mui/material";
import React, { useMemo } from "react";

interface IIconPickerProps {
  icons: React.ReactNode[];

  selectedIconIndex: number;
  setSelectedIconIndex: (index: number) => void;
}
const IconPicker = ({
  icons,
  selectedIconIndex,
  setSelectedIconIndex,
}: IIconPickerProps) => {
  const renderIcons = useMemo((): React.ReactNode => {
    return icons.map((e, index) => {
      return (
        <ListItem className="w-max p-2" key={`icon-picker-${index}`}>
          <ListItemButton
            selected={selectedIconIndex === index}
            onClick={() => setSelectedIconIndex(index)}
          >
            <IconButton>{e}</IconButton>
          </ListItemButton>
        </ListItem>
      );
    });
  }, [icons, selectedIconIndex]);

  return (
    <List className="flex flex-row gap-1 flex-wrap w-full">{renderIcons}</List>
  );
};

export default IconPicker;
