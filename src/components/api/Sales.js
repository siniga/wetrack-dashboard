import axios from 'axios';


// Function to fetch sales queries from the API
export const fetchSales= async (axiosInstance,businessId) => {
  try {
    const response = await axiosInstance.get(`orders/business/${businessId}`);
    return response.data.order;
  } catch (error) {
    console.error('Error fetching sales queries:', error);
    return null;
  }
};

// Function to add a new sales query to the API
export const addSalesQuery = async (axiosInstance,queryData) => {
  try {
    const response = await axiosInstance.post('/sales-queries', queryData);
    return response.data;
  } catch (error) {
    console.error('Error adding sales query:', error);
    return null;
  }
};

// Function to update a sales query in the API
export const updateSalesQuery = async (axiosInstance,queryId, updatedQueryData) => {
  try {
    const response = await axiosInstance.put(`/sales-queries/${queryId}`, updatedQueryData);
    return response.data;
  } catch (error) {
    console.error('Error updating sales query:', error);
    return null;
  }
};

// Function to delete a sales query from the API
export const deleteSalesQuery = async (axiosInstance,queryId) => {
  try {
    const response = await axiosInstance.delete(`/sales-queries/${queryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sales query:', error);
    return null;
  }
};

export const fetchSalesMarkers = async (axiosInstance,businessId, flag, userId) => {
  console.log(userId);
  try {
    const response = await axiosInstance.get(`orders/markers/business/${businessId}/flag/${flag}/user/${userId}`);
    return response.data.order;
  } catch (error) {
    console.error('Error fetching sales queries:', error);
    return null;
  }
};
