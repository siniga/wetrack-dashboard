// Function to fetch team data from the API
export const fetchTeamData = async (axiosInstance, businessId) => {
  try {
    const response = await axiosInstance.get(`/teams/business/${businessId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching team data:", error);
    return null;
  }
};

// Function to add team data to the API
export const addTeamData = async (axiosInstance, teamData) => {
  try {
    const response = await axiosInstance.post(`teams`, teamData);
    return response.data;
  } catch (error) {
    console.error("Error adding team data:", error);
    return null;
  }
};

// Function to update team data in the API
export const updateTeamData = async (axiosInstance,teamId, updatedTeamData, setIsLoading) => {
  try {
    const response = await axiosInstance.put(`${teamId}`, updatedTeamData);

    if (response) {
      setIsLoading(false);
      return response.data;
    }
  } catch (error) {
    console.error("Error updating team data:", error);
    return null;
  }
};

// Function to delete team data from the API
export const deleteTeamData = async (axiosInstance,teamId) => {
  try {
    const response = await axiosInstance.delete(`/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting team data:", error);
    return null;
  }
};

export const assignTeamSupervisor = async (axiosInstance, data) => {
  try {
    const response = await axiosInstance.post(`teams/assign/supervisor`,data);
    return response.data;
  } catch (error) {
    console.error("Error deleting team data:", error);
    return null;
  }
};

