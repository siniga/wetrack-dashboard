import axios from 'axios';
import { BaseUrl } from '../settings/BaseUrl';
import { useContext } from 'react';


// Function to fetch products from the API
export const fetchProducts = async (axiosInstance,businessId) => {
  try {
    const response = await axiosInstance.get(`products/business/${businessId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
};

// Function to add a new product to the API
export const addProduct = async (axiosInstance,productData) => {
  try {
    const response = await axiosInstance.post('products', productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

// Function to update a product in the API
export const updateProduct = async (axiosInstance,productId, updatedProductData) => {
  try {
    const response = await axiosInstance.put(`/products/${productId}`, updatedProductData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Function to delete a product from the API
export const deleteProduct = async (axiosInstance,productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    return null;
  }
};
