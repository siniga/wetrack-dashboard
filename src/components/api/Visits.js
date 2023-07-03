
export const fetchVisitMarkers = async (axiosInstance,businessId, userId) => {
  try {
    const response = await axiosInstance.get(`visits/markers/business/${businessId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales queries:', error);
    return null;
  }
};


export const fetchLocations = async (axiosInstance,businessId, filter) => {
  try {
    const response = await axiosInstance.get(`maps/sales/business/${businessId}?filter=${filter}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales queries:', error);
    return null;
  }
};

  