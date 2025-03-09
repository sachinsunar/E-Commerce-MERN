import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { backendUrl } from '../../../admin/src/App';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(backendUrl + '/api/user/all');
                setUsers(res.data.Users);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch users');
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className='p-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Users List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className='w-full border border-gray-300'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='border p-2'>S.N</th>
                            <th className='border p-2'>Name</th>
                            <th className='border p-2'>Email</th>
                            <th className='border p-2'>Registered At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user._id}>
                                    <td className='border p-2 text-center'>{index + 1}</td>
                                    <td className='border p-2'>{user.name}</td>
                                    <td className='border p-2'>{user.email}</td>
                                    <td className='border p-2'>{new Date(user.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='4' className='border p-2 text-center'>No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Users;
