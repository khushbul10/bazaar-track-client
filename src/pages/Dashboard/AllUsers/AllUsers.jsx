// src/pages/AllUsers.jsx

import React from 'react';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../../Shared/Loader/Loader';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const AllUsers = () => {
  const { user: thisUser } = useAuth(); // Get the logged-in user data
  const axiosSecure = useAxiosSecure();

  // Fetch users using react-query
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosSecure.get('/users');
      return response.data;
    }
  });

  if (isLoading) {
    return <Loader />;
  }

  // Handle role update for a user
  const handleRoleUpdate = async (userId, currentRole, newRole) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to change the role of this user from ${currentRole}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change role'
    });

    if (!result.isConfirmed) {
      return; // User cancelled the action
    }

    try {
      // Send request to update the role
      await axiosSecure.patch(`/users/${userId}`, { role: newRole });
      refetch(); // Refetch users to get updated data
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Name</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Email</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Role</th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(
              (user) =>
                user.email !== thisUser.email && (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.name}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.email}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.role}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      {/* Conditionally render Promote / Demote buttons */}
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => handleRoleUpdate(user._id, user.role, 'vendor')}
                          className="bg-green-600 text-white py-1 px-4 rounded-md mr-2 hover:bg-green-700 transition duration-300"
                        >
                          Demote to Vendor
                        </button>
                      ) : user.role === 'vendor' ? (
                        <>
                          <button
                            onClick={() => handleRoleUpdate(user._id, user.role, 'admin')}
                            className="bg-green-600 text-white py-1 px-4 rounded-md mr-2 hover:bg-green-700 transition duration-300"
                          >
                            Promote to Admin
                          </button>
                          <button
                            onClick={() => handleRoleUpdate(user._id, user.role, 'user')}
                            className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition duration-300"
                          >
                            Demote to User
                          </button>
                        </>
                      ) : user.role === 'user' ? (
                        <button
                          onClick={() => handleRoleUpdate(user._id, user.role, 'vendor')}
                          className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700 transition duration-300"
                        >
                          Promote to Vendor
                        </button>
                      ) : null}
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
