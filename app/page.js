
"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/form");
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setIsUpdate(false);
    setSelectedRows([]);
    setErrors({});
  };

  const handleUpdate = (id) => {
    const selectedItem = tableData.find((item) => item._id === id);
    setFormData(selectedItem);
    setIsOpen(true);
    setIsUpdate(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (isUpdate) {
        await axios.put(
          `http://localhost:8000/api/form/${formData._id}`,
          formData
        );
        toast.success("Data updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/form", formData);
        toast.success("Data added successfully!");
      }
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        hobbies: "",
      });
      togglePopup();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/form/${id}`);
      fetchData();
      toast.success("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Error deleting data:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    const index = selectedRows.indexOf(id);
    if (index === -1) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const validateForm = (formData) => {
    let errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = "Name is required and must be at least 3 characters";
    }
    if (!formData.hobbies.trim() || formData.hobbies.trim().length < 3) {
      errors.hobbies = "Hobbies are required and must be at least 3 characters";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  const sendEmail = async () => {
    const selectedRowData = tableData.filter((item) =>
      selectedRows.includes(item._id)
    );
  
    try {
      await axios.post("http://localhost:8000/send-email", {
        to: "info@redpositive.in",
        subject: "Selected Row Data",
        body: JSON.stringify(selectedRowData),
      });
  
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email request:", error);
      toast.error("Error sending email:", error);
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
        Add
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
            <h2 className="text-xl mb-4">{isUpdate ? "Update Data" : "Form"}</h2>
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
                  className={`mt-1 p-2 border rounded-md w-full ${errors.name && 'border-red-500'}`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                  className={`mt-1 p-2 border rounded-md w-full ${errors.phoneNumber && 'border-red-500'}`}
                  required
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
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
                  className={`mt-1 p-2 border rounded-md w-full ${errors.email && 'border-red-500'}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                  className={`mt-1 p-2 border rounded-md w-full ${errors.hobbies && 'border-red-500'}`}
                  required
                />
                {errors.hobbies && <p className="text-red-500 text-sm">{errors.hobbies}</p>}
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
                  {isUpdate ? "Update Data" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <section className="w-full">
        <table className="w-full border-collapse border border-gray-200 mb-8 text-center">
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
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(item._id)}
                    checked={selectedRows.includes(item._id)}
                  />
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
        <div className="flex items-center justify-center">
          <button
            onClick={sendEmail}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Send Email
          </button>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default FormWithButton;
