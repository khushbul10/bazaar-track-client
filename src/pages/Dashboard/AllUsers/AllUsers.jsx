import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../../Shared/Loader/Loader';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import useAuth from '../../../hooks/useAuth';

const AllUsers = () => {
  const { user: thisUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  // Debounce search input to avoid spamming requests
  const handleSearchChange = (value) => {
    setSearch(value);
    refetch();
  };

  // Fetch users with search query
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users?search=${search}`);
      return response.data;
    }
  });

  // if (isLoading) return <Loader />;

  const handleRoleUpdate = async (userId, currentRole, newRole) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Change role from ${currentRole} to ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change role'
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/users/${userId}`, { role: newRole });
      refetch();
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="md:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          onChange={(e) => handleSearchChange(e.target.value)}
          className="input input-bordered w-full md:w-1/2"
        />
      </div>

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
            {users.length > 0 ? users.map(
              (user) =>
                user.email !== thisUser.email && (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.name}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.email}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.role}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => handleRoleUpdate(user._id, user.role, 'vendor')}
                          className="bg-green-600 w-full text-white py-1 px-4 rounded-md hover:bg-green-700 transition duration-300"
                        >
                          Demote to Vendor
                        </button>
                      ) : user.role === 'vendor' ? (
                        <>
                          <button
                            onClick={() => handleRoleUpdate(user._id, user.role, 'admin')}
                            className="bg-green-600 w-full mt-2 text-white py-1 px-4 rounded-md hover:bg-green-700 transition duration-300"
                          >
                            Promote to Admin
                          </button>
                          <button
                            onClick={() => handleRoleUpdate(user._id, user.role, 'user')}
                            className="bg-red-600 w-full mt-2 text-white py-1 px-4 rounded-md hover:bg-red-700 transition duration-300"
                          >
                            Demote to User
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRoleUpdate(user._id, user.role, 'vendor')}
                          className="bg-green-600 w-full mt-2 text-white py-1 px-4 rounded-md hover:bg-green-700 transition duration-300"
                        >
                          Promote to Vendor
                        </button>
                      )}
                    </td>
                  </tr>
                )
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
