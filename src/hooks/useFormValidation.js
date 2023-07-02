import { useState } from 'react';

const useFormValidation = (initialFields) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    console.log(formData);
    for (const field of initialFields) {
        
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Perform your form submission logic here
      console.log('Form is valid');
      // Reset form data
      setFormData({});
    } else {
      console.log('Form validation failed');
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
  };
};

export default useFormValidation;
