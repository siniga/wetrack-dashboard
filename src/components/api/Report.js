

// Function to fetch categories from the API
export const fetchReports = async (axiosInstance, businessId, dayFilter) => {
  try {
    const response = await axiosInstance.get(`reports/business/${businessId}?filter=${dayFilter}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching visits:', error);
    return null;
  }
};

// Function to fetch categories from the API
export const fetchUserReports = async (axiosInstance, userId, businessId, dayFilter) => {
  try {
    const response = await axiosInstance.get(`/reports/user/${userId}/business/${businessId}?filter=${dayFilter}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching visits:', error);
    return null;
  }
};
  

  