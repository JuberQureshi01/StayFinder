import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; 
import { createProperty } from "../features/properties/propertySlice";
import MainLayout from "../components/layout/MainLayout";
import { UploadCloud, X, Bot } from "lucide-react";

const CreateListingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.properties);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "APARTMENT",
    category: "Trending",
    location: "",
    basePricePerNight: 1000,
    amenities: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });
    imageFiles.forEach((file) => {
      submissionData.append("images", file);
    });
    const result = await dispatch(createProperty(submissionData));
    if (createProperty.fulfilled.match(result)) {
      navigate("/my-listings");
    }
    else{
      navigate("/login");
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create a New Listing</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full mt-1 p-2 border rounded-md"
            ></textarea>
            <div className="text-right mt-2">
              <Link
                to="/ai-description-generator"
                target="_blank"
                className="text-sm text-[#FF385C] hover:underline font-semibold flex items-center justify-end"
              >
                <Bot size={16} className="mr-1" />
                Need help? Generate with AI
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="propertyType"
                className="block text-sm font-medium"
              >
                Property Type
              </label>
              <select
                name="propertyType"
                id="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option>APARTMENT</option>
                <option>HOUSE</option>
                <option>HOTEL</option>
                <option>UNIQUE_STAY</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option>Trending</option>
                <option>Mountains</option>
                <option>Beachfront</option>
                <option>Swimming Pools</option>
                <option>Countryside</option>
                <option>City Center</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="basePricePerNight"
              className="block text-sm font-medium"
            >
              Price per Night (₹)
            </label>
            <input
              type="number"
              name="basePricePerNight"
              id="basePricePerNight"
              value={formData.basePricePerNight}
              onChange={handleChange}
              required
              min="0"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="amenities" className="block text-sm font-medium">
              Amenities (comma-separated)
            </label>
            <input
              type="text"
              name="amenities"
              id="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="e.g. Wifi, Pool, Kitchen"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Property Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#FF385C] hover:text-red-500 focus-within:outline-none"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="images"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`preview ${index}`}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF385C] text-white font-bold py-3 rounded-lg hover:bg-red-600 transition disabled:bg-red-300"
          >
            {loading ? "Creating Listing..." : "Create Listing"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateListingPage;
