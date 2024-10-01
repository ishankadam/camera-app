import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import _ from "lodash";
import React, { useState } from "react";

const SelectDropdown = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    props.handleEdit(e.target.value, props.config.field);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (props.value === null || props.value === "") {
      setIsFocused(false);
    }
  };

  const updateMenuItems = (data) => {
    return _.map(data, (obj, index) => (
      <MenuItem key={index} value={obj.value}>
        {obj.label}
      </MenuItem>
    ));
  };

  const menuItems = updateMenuItems(_.get(props, "optionList", []));
  const isActive = (props.value !== null && props.value !== "") || isFocused;

  return (
    <FormControl
      className={props.className || "select-condition-list"}
      variant="outlined"
      fullWidth
      margin="normal"
      sx={{ ...props.sx }}
    >
      <InputLabel
        id={`select-label-${props.id}`}
        shrink={isActive}
        sx={{ left: isActive ? 0 : "10%", top: isActive ? 0 : "-15%" }}
      >
        {props.label}
      </InputLabel>
      <Select
        aria-labelledby={`select-label-${props.id}`}
        size={props.size || "medium"}
        id={props.id || "select-dropdown"}
        className={props.className || "select-dropdown"}
        label={props.label}
        variant={props.variant || "outlined"}
        sx={{ ...props.sx }}
        value={props.value || ""}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        notched={isActive}
        startAdornment={
          props.startAdornment ? (
            <InputAdornment position="start">{props.icon}</InputAdornment>
          ) : null
        }
      >
        {menuItems}
      </Select>
    </FormControl>
  );
};

export default SelectDropdown;
