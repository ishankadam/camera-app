import React, { useState } from "react";
import { TextField } from "@mui/material";

const CustomTextField = (props) => {
  const [textValue, setTextValue] = useState("");

  const handleEdit = (value) => {
    setTextValue(value);
    props.handleEdit(value, props.config.field);
  };

  return (
    <TextField
      value={textValue}
      variant={props.variant ? props.variant : "outlined"}
      placeholder={props.placeholder ? props.placeholder : ""}
      InputProps={props.InputProps && props.InputProps}
      sx={props.sx && props.sx}
      size={props.size ? props.size : "medium"}
      onChange={(event) => handleEdit(event.target.value)}
    />
  );
};

export default CustomTextField;
