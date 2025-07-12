import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const fetchUserRole = async (email, axiosSecure) => {
  const response = await axiosSecure.get('/users/role', {
    params: { email }, // Pass the email as query parameter
  });
  return response.data.role; // Extract role from the response
};

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth(); // Get the authenticated user from useAuth
  const axiosSecure = useAxiosSecure(); // Get the axios instance from the custom hook

  // Only fetch the role if the user is logged in
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['userRole', user?.email], // Unique key for the query
    queryFn: () => {
      if (user?.email) {
        return fetchUserRole(user.email, axiosSecure); // Fetch user role if email is available
      } else {
        return Promise.resolve(null); // Return null if no user email is available
      }
    },
    enabled: authLoading || !!user?.email, // Only run the query if user email is available
  }
  );

  return {
    role: data,
    isLoading,
    isError,
    refetch,
  };
};

export default useUserRole;