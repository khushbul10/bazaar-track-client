import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const useUploadImage = () => {
  const mutation = useMutation({
    mutationFn: async (imageFile) => {
      const folder = 'daily-price-tracker';

      // 1️⃣ Get signed parameters from your server
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cloudinary/signature?folder=${folder}`);
      const { timestamp, signature, apiKey, cloudName } = data;
      console.

      // 2️⃣ Prepare FormData for upload
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      // 3️⃣ Upload to Cloudinary
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      return uploadResponse.data.secure_url;
    },
  });

  return {
    uploadImage: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

export default useUploadImage;
