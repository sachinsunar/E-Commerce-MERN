import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { backendUrl } from "../../../admin/src/App";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/all");
      setUsers(res.data.Users);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await axios.delete(
          backendUrl + `/api/user/delete/${userId}`,
        );
        if (res.data.success) {
          toast.success("User deleted successfully");
          fetchUsers();
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all fields");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.put(
        backendUrl + `/api/user/update/${selectedUser._id}`,
        { name: formData.name, email: formData.email },
      );
      if (res.data.success) {
        toast.success("User updated successfully");
        setShowModal(false);
        fetchUsers();
      } else {
        toast.error(res.data.message || "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">S.N</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Registered At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border p-2 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
