import apiPaths from "./apiRoutes";
import axios from "axios";

export const callServer = async (path, params) => {
  const requestUrl = `${apiPaths.baseUrl}${path}`;
  console.log(requestUrl);
  axios.defaults.withCredentials = true;
  let result = {};
  try {
    const { data, status, statusText } = await axios.post(requestUrl, params, {
      method: "POST",
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (status === 200) {
      result = data;
    } else {
      result = { result: statusText };
    }
  } catch (error) {
    console.log(error);
  }
  //
  return result;
};
