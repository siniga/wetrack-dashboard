import axios from 'axios';
import { BaseUrl } from '../settings/BaseUrl';

// const BASE_URL = BaseUrl('/regions');
// const token = localStorage.getItem('token');

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`, // Replace with your actual authorization token
//   },
// });

// Function to fetch region data from the API
export const fetchRegionData = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get('/regions');
    return response.data;
  } catch (error) {
    console.error('Error fetching region data:', error);
    return null;
  }
};

// // Function to add region data to the API
// export const addRegionData = async (regionData) => {
//   try {
//     const response = await axios.post(`${BASE_URL}`, regionData);
//     return response.data;
//   } catch (error) {
//     console.error('Error adding region data:', error);
//     return null;
//   }
// };

// // Function to update region data in the API
// export const updateRegionData = async (regionId, updatedRegionData, setIsLoading) => {
//   try {
//     const response = await axiosInstance.put(`${regionId}`, updatedRegionData);

//     if (response) {
//       setIsLoading(false);
//       return response.data;
//     }
//   } catch (error) {
//     console.error('Error updating region data:', error);
//     return null;
//   }
// };

// // Function to delete region data from the API
// export const deleteRegionData = async (regionId) => {
//   try {
//     const response = await axiosInstance.delete(`/${regionId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting region data:', error);
//     return null;
//   }
// };
