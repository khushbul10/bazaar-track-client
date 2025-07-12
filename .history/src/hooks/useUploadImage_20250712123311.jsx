import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Custom hook for uploading an image to Cloudinary using TanStack Query.
 * @returns {Object} { mutate: uploadImage, data, isLoading, isError, error, isSuccess }
 */
const useUploadImage = () => {
  const mutation = useMutation({
    mutationFn: async (imageFile) => {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percent}%`);
          },
        }
      );

      return response.data.secure_url; // Return the hosted URL
    },
  });

  return mutation;
};

export default useUploadImage;
