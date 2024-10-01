import React, { useEffect, useState } from "react";
import CustomTable from "../../components/custom-table/customTable";
import { editCameraStatus } from "../../api";

const CameraTable = (props) => {
  const [cameraData, setCameraData] = useState([]);

  useEffect(() => {
    setCameraData(props.data);
  }, [props.data]);

  const handleEdit = (row, value) => {
    props.setLoading(true);
    editCameraStatus({
      id: row.id,
      status: value === "Active" ? "Inactive" : "Active",
      setCameraData,
      setLoading: props.setLoading,
      cameraData,
    });
  };

  const handleDelete = (row, index) => {
    setCameraData((prevCameraData) => {
      return prevCameraData.filter((camera) => camera.id !== row.id);
    });
  };
  const colDef = [
    {
      id: "camera-name",
      label: "Name",
      key: "name",
      iconKey: "current_status",
      hasWarningKey: "hasWarning",
      type: "textWithStartAndEndIcon",
      align: "left",
    },
    {
      id: "health",
      label: "Health",
      key: "health",
      type: "iconWithTextInLoader",
      align: "center",
    },
    {
      id: "location",
      label: "Location",
      key: "location",
      type: "text",
      align: "left",
    },
    {
      id: "recorder",
      label: "Recorder",
      key: "recorder",
      type: "text",
      align: "left",
    },
    {
      id: "tasks",
      label: "Tasks",
      key: "tasks",
      type: "valueWithText",
      textValue: "Tasks",
      align: "center",
    },
    {
      id: "status",
      label: "Status",
      key: "status",
      type: "chip",
      align: "center",
      editFunc: (row, value, index) => handleEdit(row, value, index),
    },
    {
      id: "delete-icon",
      label: "Actions",
      type: "action",
      key: "status",
      align: "center",
      deleteId: "delete-icon",
      deleteFunc: (row, index) => handleDelete(row, index),
      isDelete: true,
    },
  ];
  return (
    <div>
      <CustomTable
        colDef={colDef}
        rowData={cameraData}
        deleteContent={{
          title: "Delete Confirmation",
          message: "Are you sure you want to delete this record?",
        }}
        loading={props.loading}
      ></CustomTable>
    </div>
  );
};

export default CameraTable;
