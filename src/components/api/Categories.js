

// Function to fetch categories from the API
export const fetchCategories = async (axiosInstance, businessId) => {
  try {
    const response = await axiosInstance.get(`/categories/business/${businessId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
};

// Function to add a new category to the API
export const addCategory = async (categoryData, axiosInstance) => {
  try {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    return null;
  }
};

// Function to update a category in the API
export const updateCategory = async (categoryId, updatedCategoryData, axiosInstance) => {
  try {
    const response = await axiosInstance.put(`/categories/${categoryId}`, updatedCategoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
};

// Function to delete a category from the API
export const deleteCategory = async (categoryId, axiosInstance) => {
  try {
    const response = await axiosInstance.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    return null;
  }
};
