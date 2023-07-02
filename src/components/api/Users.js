// Function to fetch users data from the API
export const fetchUsersData = async (axiosInstance, bid) => {
  try {
    const response = await axiosInstance.get(`users/business/${bid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
};

// Function to fetch user data from the API
export const fetchUserData = async (axiosInstance, bid) => {
  try {
    const response = await axiosInstance.get(`${bid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error;
  }
};

// Function to add user data to the API
export const addUserData = async (axiosInstance, userData) => {

  try {
    const response = await axiosInstance.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user data:", error);
    return null;
  }
};

// Function to update user data in the API
export const updateUserData = async (
  axiosInstance,
  userId,
  updatedUserData
) => {
  try {
    const response = await axiosInstance.put(
      `users/${userId}`,
      updatedUserData
    );

    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    return null;
  }
};

// Function to delete user data from the API
export const deleteUserData = async (axiosInstance, userId) => {
  try {
    const response = await axiosInstance.delete(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user data:", error);
    return null;
  }
};

export const updateUserPassword = async (axiosInstance, updatedUserData) => {
  try {
    const response = await axiosInstance.post(
      `users/update-password`,
      updatedUserData
    );

    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    return error.response.data;
  }
};

export const fetchSupervisors = async (axiosInstance, role, businessId) => {
  try {
    const response = await axiosInstance.get(
      `users/role/${role}/business/${businessId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating team data:", error);
    return error.response.data;
  }
};

export const fetchUsersByRegions = async (
  axiosInstance,
  businessId,
  regionId
) => {
  try {
    const response = await axiosInstance.get(
      `users/business/${businessId}/region/${regionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating team data:", error);
    return error.response.data;
  }
};

export const fetchUserVisits = async (
  axiosInstance,
  businessId,
  regionId
) => {
  try {
    const response = await axiosInstance.get(
      `users/visits/business/${businessId}/region/${regionId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating team data:", error);
    return error.response.data;
  }
};


export const fetchUsersByBusinessId = async (
  axiosInstance,
  businessId
) => {
  try {
    const response = await axiosInstance.get(
      `agents/business/${businessId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating team data:", error);
    return error.response.data;
  }
};


export const assignUsersToTeam = async (axiosInstance, userData) => {

  try {
    const response = await axiosInstance.post("/users/assign-team", userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user data:", error);
    return null;
  }
};
