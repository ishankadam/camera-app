const { REACT_APP_API_TOKEN } = process.env;
const apiToken = REACT_APP_API_TOKEN;

export const getCameraData = async ({
  setCameraData,
  setLocationList,
  setLoading,
}) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiToken,
    },
  };
  try {
    const response = await fetch(
      `https://api-app-staging.wobot.ai/app/v1/fetch/cameras`,
      requestOptions
    );
    if (response.ok) {
      const responseData = await response.json();
      setCameraData(responseData.data);
      let locationList = [];
      responseData.data.forEach((row) => {
        if (!locationList.some((location) => location.value === row.location)) {
          locationList.push({
            label: row.location,
            value: row.location,
          });
        }
      });
      locationList.splice(0, 0, {
        label: "All",
        value: "All",
      });
      setLocationList(locationList);
    } else {
      throw new Error("Failed to fetch cameras");
    }
  } catch (error) {
    console.error("Error fetching camera data:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

export const editCameraStatus = async ({
  id,
  status,
  setCameraData,
  setLoading,
  cameraData,
}) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiToken,
    },
    body: JSON.stringify({
      id: id,
      status: status,
    }),
  };

  try {
    const response = await fetch(
      `https://api-app-staging.wobot.ai/app/v1/update/camera/status`,
      requestOptions
    );

    if (response.ok) {
      const responseData = await response.json();
      setCameraData((prevCameraData) =>
        prevCameraData.map((camera) =>
          camera.id === responseData.data.id
            ? { ...camera, ...responseData.data }
            : camera
        )
      );
    } else {
      throw new Error("Failed to fetch cameras");
    }
  } catch (error) {
    console.error("Error fetching camera data:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
