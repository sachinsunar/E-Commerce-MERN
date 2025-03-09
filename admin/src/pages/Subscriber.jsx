import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { backendUrl } from '../App';


const Subscriber = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const res = await axios.get(backendUrl + '/api/user/subscriber-list');
                setSubscribers(res.data.Subscribers);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch subscribers');
                setLoading(false);
            }
        };
        fetchSubscribers();
    }, []);


    return (
        <div className='p-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Subscribers List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className='w-full border border-gray-300'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='border p-2'>S.N</th>
                            <th className='border p-2'>Email</th>
                            <th className='border p-2'>Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.length > 0 ? (
                            subscribers.map((subscriber, index) => (
                                <tr key={subscriber._id}>
                                    <td className='border p-2 text-center'>{index + 1}</td>
                                    <td className='border p-2'>{subscriber.email}</td>
                                    <td className='border p-2'>{new Date(subscriber.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='3' className='border p-2 text-center'>No subscribers found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Subscriber;