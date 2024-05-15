// components/FormWithButton.js
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const FormWithButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    hobbies: "",
  });
  const [tableData, setTableData] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId,setUpdateId] = useState();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/form"); // Replace 'http://localhost:3000/api/form' with your backend API endpoint
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setIsUpdate(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = (id) => {
    const data = tableData.find((t) => t._id === id);
    console.log(data);
    setUpdateId(data._id)
    setFormData({
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      hobbies: data.hobbies,
    });
    togglePopup();
    setIsUpdate(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      isUpdate === true
        ? await axios.put(`http://localhost:3000/api/form/${updateId}`, formData)
        : await axios.post("http://localhost:3000/api/form", formData); // Replace 'http://localhost:3000/api/form' with your backend API endpoint
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        hobbies: "",
      });
      togglePopup();
      fetchData(); // Fetch updated data after submission
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/form/${id}`); // Replace 'http://localhost:3000/api/form' with your backend API endpoint
      fetchData(); // Fetch updated data after deletion
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto">
      <h1 className="text-3xl font-bold mb-4">CURDS</h1>
      <p className="text-lg text-center mb-8">
        "Life is beautiful when you learn to be grateful for what you have."
      </p>
      <button
        onClick={togglePopup}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Open Form
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-xl mb-4">Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number:
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="hobbies"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hobbies:
                </label>
                <input
                  type="text"
                  id="hobbies"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="bg-gray-400 hover:bg-gray-500 text-gray-800 px-4 py-2 mr-2 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <section className="w-full">
        <table className="w-full border-collapse border border-gray-200 mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2">Select</th>
              <th className="border border-gray-200 px-4 py-2">ID</th>
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Phone Number</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Hobbies</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={item._id}>
                <td className="border border-gray-200 px-4 py-2">
                  <input type="checkbox" />
                </td>
                <td className="border border-gray-200 px-4 py-2">{index}</td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.phoneNumber}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.email}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.hobbies}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  <button
                    onClick={() => handleUpdate(item._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default FormWithButton;
