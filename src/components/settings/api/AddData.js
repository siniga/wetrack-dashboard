import axios from "axios";
import { authToken } from "../Authentication";
import { BaseUrl } from "../BaseUrl";

export function AddData(endpoint, submitedData) {
  const addData = async () => {
    const headers = {
      Authorization: "Bearer " + authToken(),
      "Content-Type": "application/json",
    };

    const {data}= await axios({
      url:BaseUrl(endpoint), 
      method:"post",
      headers:headers,
      data:submitedData
   });

    return data;
  };
  return addData();

}
