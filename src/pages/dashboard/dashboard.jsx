import React, { useEffect, useMemo, useState } from "react";
import { getCameraData } from "../../api";
import { InputAdornment, Stack, Typography } from "@mui/material";
import CustomTextField from "../../components/textfield/customTextfield";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RssFeedOutlinedIcon from "@mui/icons-material/RssFeedOutlined";
import "./dashboard.css";
import SelectDropdown from "../../components/select-dropdown/selectDropdown";
import CameraTable from "../cameraTable/cameraTable";
import { statusList } from "../../common";
import wobotLogo from "../../assets/wobot_logo.png";

const Dashboard = () => {
  const [cameraData, setCameraData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    location: "",
    status: "",
    search: "",
  });
  const [locationList, setLocationList] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCameraData({ setCameraData, setLocationList, setLoading });
  }, []);

  const handleFilterChange = (value, field) => {
    setFilterOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredData = useMemo(() => {
    return (
      cameraData.length > 0 &&
      cameraData.filter((camera) => {
        const matchesLocation =
          filterOptions.location && filterOptions.location !== "All"
            ? camera.location === filterOptions.location
            : true;

        const matchesStatus =
          filterOptions.status && filterOptions.status !== "All"
            ? camera.status === filterOptions.status
            : true;

        const matchesSearch = filterOptions.search
          ? Object.values(camera).some((value) => {
              // Check for nested objects
              if (typeof value === "object" && value !== null) {
                return Object.values(value).some((nestedValue) =>
                  String(nestedValue)
                    .toLowerCase()
                    .includes(filterOptions.search.toLowerCase())
                );
              }
              // Check flat properties
              return String(value)
                .toLowerCase()
                .includes(filterOptions.search.toLowerCase());
            })
          : true;
        return matchesLocation && matchesStatus && matchesSearch;
      })
    );
  }, [cameraData, filterOptions]);
  const startAdornment = <InputAdornment position="start"></InputAdornment>;

  return (
    <div className="dashboard-container">
      <div className="logo-container">
        <img
          src={wobotLogo}
          alt="wobot-logo"
          width="160px"
          height="120px"
        ></img>
      </div>
      <div className="dashboard-header">
        <div className="dashboard-header-wrapper">
          <Typography variant="h4">Cameras</Typography>
          <Typography sx={{ color: "#9b9c9e" }}>
            Manage your cameras here.
          </Typography>
        </div>
        <div className="search-filter">
          <CustomTextField
            placeholder="Search"
            size="small"
            handleEdit={handleFilterChange}
            config={{ field: "search" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              border: "none",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              borderRadius: "5%",
              backgroundColor: "#e3e5e8",
            }}
          ></CustomTextField>
        </div>
      </div>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        className="filter-wrapper"
      >
        <SelectDropdown
          size="small"
          label="Location"
          className="filter-dropdown"
          value={filterOptions.location}
          startAdornment={startAdornment}
          icon={<LocationOnOutlinedIcon />}
          optionList={locationList}
          handleEdit={handleFilterChange}
          config={{ field: "location" }}
          sx={{ width: { xs: "100%", sm: "250px" } }}
        />
        <SelectDropdown
          size="small"
          label="Status"
          className="filter-dropdown"
          value={filterOptions.status}
          startAdornment={startAdornment}
          icon={<RssFeedOutlinedIcon />}
          optionList={statusList}
          handleEdit={handleFilterChange}
          config={{ field: "status" }}
          sx={{ width: { xs: "100%", sm: "250px" } }}
        />
      </Stack>
      <div className="cameras-table-container">
        <CameraTable
          data={filteredData}
          loading={loading}
          setLoading={setLoading}
          setCameraData={setCameraData}
        ></CameraTable>
      </div>
    </div>
  );
};

export default Dashboard;
