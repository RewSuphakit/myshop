import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { toast } from 'react-toastify';
function AddProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0); // set initial value to 0
  const [stockQuantity, setStockQuantity] = useState(0); // set initial value to 0
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('Select Category'); // เพิ่มตัวแปรเพื่อเก็บชื่อหมวดหมู่ที่เลือก
  const [previewImage, setPreviewImage] = useState(null);// เพิ่มตัวแปรสำหรับเก็บ URL ของรูปภาพที่แสดงตัวอย่าง
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categories/");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', parseFloat(price));
      formData.append('stock_quantity', parseInt(stockQuantity));
      formData.append('image', image);
      formData.append('category_id', categoryId);
    
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Product add successfully!');
        setName('');
        setDescription('');
        setPrice(0);
        setStockQuantity(0);
        setImage(null);
        setCategoryId('');
        setPreviewImage(null)
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);

    // หาชื่อของหมวดหมู่ที่เลือก
    const selectedCategory = categories.find(category => category.category_id === selectedCategoryId);
    setSelectedCategoryName(selectedCategory.name);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file)); // ใช้ URL.createObjectURL() เพื่อสร้าง URL สำหรับแสดงตัวอย่างรูปภาพ
  };
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="card lg:card-side bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <h1 className="text-[30px] font-bold">Add Product</h1>
          <div className="flex justify-end">
            <button className="btn btn-primary" type="submit">
              Add Product
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-1 lg:w-3/4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="card bg-base-100 shadow-xl mt-4 p-4">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="input input-bordered w-full"
                  name="name"
                  required
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  required
                  name="description"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="card lg:card-side bg-base-100 shadow-xl mt-4">
              <div className="card-body">
                <h2>Product Media</h2>
               <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
  {previewImage ? (
    <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover" /> // ถ้ามีรูปภาพตัวอย่างแสดงรูป
  ) : (
    <div className="text-center">
      <div className="mt-4 flex text-sm leading-6 text-gray-600">
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-full py-2 rounded-lg"
        >
          <MdOutlineAddPhotoAlternate size={20} className="mr-2" />
          <span>Upload a file</span>
          <input
            id="file-upload"
            name="image"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  )}
</div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
              </div>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-1">
            <div className="card bg-base-100 shadow-xl mt-4 p-4">
              <h2 className="text-xl font-semibold mb-4">Price and Quantity</h2>
              <div className="mb-4">
                <label htmlFor="price" className="block mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  className="input input-bordered w-full"
                  required
                  name="price"
                  min="0"
                  value={price} 
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="stock_quantity" className="block mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                   min="0"
                  className="input input-bordered w-full"
                  name="stock_quantity"
                  value={stockQuantity} 
                  onChange={(e) => setStockQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="card bg-base-100 shadow-xl mt-4 p-4">
              <h2 className="text-xl font-semibold mb-4">Category</h2>
              <select
                id="category"
                className="border rounded-md py-1 px-2"
                required
                value={categoryId}
                onChange={handleCategoryChange} // เรียกใช้ handleCategoryChange เมื่อมีการเปลี่ยนแปลง
              >
                <option key="" value="">Select Category</option>
                {categories.map(category =>
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddProductForm;
