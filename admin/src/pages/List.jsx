import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // product to confirm delete
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const res = await axios.post(backendUrl + `/api/product/list`);
      if (res.data.success) {
        setList(res.data.products.reverse());
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    setDeletingId(id);
    try {
      const res = await axios.delete(`${backendUrl}/api/product/remove/${id}`, {
        headers: { token },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2 ">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* -----------list table title--------------- */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Images</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* -----------product list---------- */}
        {list.map((item) => (
          <div
            className="grid grid-cols[1fr_3fr_1fr] md: grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py border text-sm"
            key={item._id}
          >
            <img
              className="w-12 h-12 object-cover rounded-md"
              src={item.image[0]}
              alt={item.name}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>Rs.{item.price}</p>
            <div className="flex justify-center gap-4 items-center">
              {deletingId === item._id ? (
                <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-500"></div>
                </button>
              ) : (
                <img
                  onClick={() => navigate(`/edit/${item._id}`)}
                  className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
                  src={assets.edit_icon}
                  alt="Edit"
                />
              )}

              {deletingId === item._id ? (
                <button className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-500"></div>
                </button>
              ) : (
                <img
                  onClick={() => setConfirmDelete(item)}
                  className="w-6 h-6 cursor-pointer hover:opacity-80 transition"
                  src={assets.delete_icon}
                  alt="Delete"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Product</h3>
            <p className="text-gray-600 text-sm mb-1">
              Are you sure you want to delete
            </p>
            <p className="text-gray-800 font-medium text-sm mb-4 truncate">
              "{confirmDelete.name}"?
            </p>
            <p className="text-red-500 text-xs mb-5">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeProduct(confirmDelete._id);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
