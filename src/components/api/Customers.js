// Function to fetch customer queries from the API
export const fetchCustomers = async (axiosInstance,businessId) => {
  try {
    const response = await axiosInstance.get(`/customers/business/${businessId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer queries:', error);
    return null;
  }
};

// Function to add a new customer query to the API
export const addCustomerQuery = async (axiosInstance,queryData) => {
  try {
    const response = await axiosInstance.post('/customer-queries', queryData);
    return response.data;
  } catch (error) {
    console.error('Error adding customer query:', error);
    return null;
  }
};

// Function to update a customer query in the API
export const updateCustomerQuery = async (axiosInstance,queryId, updatedQueryData) => {
  try {
    const response = await axiosInstance.put(`/customer-queries/${queryId}`, updatedQueryData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer query:', error);
    return null;
  }
};

// Function to delete a customer query from the API
export const deleteCustomerQuery = async (axiosInstance,queryId) => {
  try {
    const response = await axiosInstance.delete(`/customer-queries/${queryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting customer query:', error);
    return null;
  }
};

export const fetchCustomerTypes = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(`/customers/types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer types queries:', error);
    return null;
  }
};

