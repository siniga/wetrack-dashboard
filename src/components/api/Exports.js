export const exportOrderData = async (axiosInstance) => {
    
    try {
      const response = await axiosInstance.get(`/orders/export/data`, {
        responseType: 'blob',
      });
      if (response.status === 200) {
        // Create a download link
        return response.data;
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return error;
    }
  };