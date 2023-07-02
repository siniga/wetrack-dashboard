import axios from "axios";
import { BaseUrl } from "../settings/BaseUrl";

const BASE_URL = BaseUrl("/login");
const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Replace with your actual authorization token
  },
});

export const login = async (userData) => {
  try {
    const response = await axios.post(BASE_URL, userData);
    if(response){
        // Extract the token from the response
        const {user, token} = response.data;
    
       // Store the token in localStorage
       localStorage.setItem('token', token);
       localStorage.setItem('user', JSON.stringify(user));
    }
  
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    return error;
  }
};
