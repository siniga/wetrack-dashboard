import axios from "axios";
import { authToken } from "../Authentication";
import { BaseUrl } from "../BaseUrl";

export function FetchData(endpoint) {
  const fetchData = async () => {
    const headers = {
      Authorization: "Bearer " + authToken(),
      "Content-Type": "application/json",
    };

    const { data } = await axios.get(BaseUrl(endpoint), { headers });
    return data;
  };
  return fetchData();

}
