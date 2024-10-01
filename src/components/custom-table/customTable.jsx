import {
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import ConfirmationModal from "../modal/confirmationModal";
import CircleIcon from "@mui/icons-material/Circle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FilterDramaOutlinedIcon from "@mui/icons-material/FilterDramaOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const CustomTable = (props) => {
  const [rowData, setRowData] = useState(props.rowData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [deleteInfo, setDeleteInfo] = useState({
    row: 0,
    index: 0,
    show: false,
    deleteFunc: undefined,
  });

  const [loading, setLoading] = useState(props.loading);

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  useEffect(() => {
    setRowData(props.rowData);
  }, [props.rowData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "A":
        return "#2e7d32";
      case "B":
      case "C":
      case "D":
        return "#ed6c02";
      case "F":
      default:
        return "#e3e5e8";
    }
  };

  const StatusIndicator = ({ status, icon }) => {
    const color = getStatusColor(status);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <IconButton>{icon}</IconButton>
        <div style={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={75}
            style={{ color: color }}
            thickness={5}
            size="30px"
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
            }}
          >
            {status !== "F" ? status : "-"}
          </div>
        </div>
      </div>
    );
  };

  const getCell = (colDef, row, rowIndex, colIndex) => {
    let children;
    switch (colDef.type) {
      case "text":
        children = (
          <Typography>
            {colDef.key === "recorder" && !row[colDef.key]
              ? "N/A"
              : row[colDef.key]}
          </Typography>
        );
        break;
      case "valueWithText":
        children = (
          <Typography>
            {!row[colDef.key]
              ? "N/A"
              : `${row[colDef.key]} ${colDef.textValue}`}
          </Typography>
        );
        break;
      case "textWithStartAndEndIcon":
        children = (
          <Stack
            justifyContent="left"
            alignItems="center"
            spacing={1}
            direction="row"
          >
            <CircleIcon
              color={row[colDef.iconKey] === "Online" ? "success" : "error"}
              fontSize="small" // Use "small" for consistent sizing
            />
            <Typography variant="body2">{row[colDef.key]}</Typography>
            {row[colDef.hasWarningKey] && (
              <ErrorOutlineOutlinedIcon color="warning" fontSize="small" />
            )}
          </Stack>
        );
        break;
      case "iconWithTextInLoader":
        children = (
          <Stack
            justifyContent="center"
            alignItems="center"
            spacing={1}
            direction="row"
          >
            {row[colDef.key].cloud && (
              <StatusIndicator
                progress={75}
                status={row[colDef.key].cloud}
                icon={<FilterDramaOutlinedIcon />}
              />
            )}
            {row[colDef.key].device && (
              <StatusIndicator
                progress={75}
                status="C"
                icon={<DnsOutlinedIcon />}
              />
            )}
          </Stack>
        );
        break;
      case "chip":
        children = (
          <Chip
            label={row[colDef.key]}
            sx={{
              borderRadius: 0,
              background: row[colDef.key] === "Active" ? "#cbf5dd" : "#e3e5e8",
              color: row[colDef.key] === "Active" ? "#2e7d32" : "#444444",
              fontWeight: "bold",
            }}
            onClick={(e) => {
              e.stopPropagation();
              colDef.editFunc(row, row[colDef.key], rowIndex);
            }}
          />
        );
        break;
      case "action":
        children =
          colDef.isDelete && row[colDef.key] === "Active" ? (
            <BlockOutlinedIcon
              onClick={(e) => {
                e.stopPropagation();
                setDeleteInfo({
                  row: row,
                  index: rowIndex,
                  show: true,
                  deleteFunc: colDef.deleteFunc,
                });
              }}
              sx={{ cursor: "pointer" }}
              id={`${colDef.deleteId}-${rowIndex}`}
              fontSize="30px"
            />
          ) : (
            <CheckCircleOutlineOutlinedIcon
              onClick={(e) => {
                e.stopPropagation();
                setDeleteInfo({
                  row: row,
                  index: rowIndex,
                  show: true,
                  deleteFunc: colDef.deleteFunc,
                });
              }}
              sx={{ cursor: "pointer" }}
              id={`${colDef.deleteId}-${rowIndex}`}
              fontSize="30px"
            />
          );
        break;
      default:
        children = <Typography>{row[colDef.key]}</Typography>;
    }
    return (
      <TableCell
        align={colDef.align}
        key={`header-${colDef.id}`}
        id={`${colDef.id}-column-header`}
      >
        {children}
      </TableCell>
    );
  };

  const displayedRows =
    rowData.length > 0 &&
    rowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isAllSelected =
    displayedRows.length > 0 && selectedRows.length === displayedRows.length;
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedRows(displayedRows.map((row, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckboxChange = (event, rowIndex) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, rowIndex]);
    } else {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((index) => index !== rowIndex)
      );
    }
  };

  // Check if a specific row is selected
  const isRowSelected = (rowIndex) => selectedRows.includes(rowIndex);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="job-table-header">
            <TableRow sx={{ position: "sticky", zIndex: 900, top: 0 }}>
              <TableCell sx={{ width: "10px" }}>
                <Checkbox
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < displayedRows.length
                  }
                  checked={isAllSelected}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {props.colDef.map((column) => (
                <TableCell
                  align={column.align}
                  key={`header-${column.id}`}
                  id={`${column.id}-column-header`}
                  sx={{ fontWeight: "bold" }}
                >
                  {_.upperCase(column.label)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableCell colSpan={props.colDef.length + 1} align="center">
                <CircularProgress
                  size={30}
                  thickness={2}
                  sx={{ color: "gray" }}
                />
              </TableCell>
            ) : displayedRows.length > 0 ? (
              displayedRows.map((row, rowIndex) => (
                <TableRow
                  key={`row-${rowIndex}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Checkbox
                      checked={isRowSelected(rowIndex)}
                      onChange={(event) =>
                        handleCheckboxChange(event, rowIndex)
                      }
                    />
                  </TableCell>
                  {props.colDef.map((column, colIndex) => {
                    return getCell(column, row, rowIndex, colIndex); // Assuming you have a getCell function
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={props.colDef.length + 1}>
                  <Typography align="center">No records found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rowData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showFirstButton
        showLastButton
      />
      {deleteInfo.show ? (
        <ConfirmationModal
          open={deleteInfo.show}
          title={props.deleteContent.title}
          message={props.deleteContent.message}
          handleConfirm={() => {
            deleteInfo.deleteFunc(deleteInfo.row, deleteInfo.index);
            setDeleteInfo({ show: false });
          }}
          handleCancel={() => setDeleteInfo({ show: false })}
        />
      ) : null}
    </>
  );
};

export default CustomTable;
