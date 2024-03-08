import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
function ListProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // จำนวนสินค้าต่อหน้า
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/products/`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
 

 const handleDeleteProduct = async (productId) => {
   try{
    let token = localStorage.getItem('token');
    const response = await axios.delete(`${apiUrl}/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 204) {
      toast.success('Products deleted successfully!',{
        position: "top-center"
      });
      fetchProducts();
      setProducts(products.filter(product => product.product_id !== productId));
    } else {
      console.error('Failed to delete Products:', response.data);
      toast.error('Failed to delete Products. Please try again later.');
    }
   }catch(error){
    console.log(error)
   }
 }
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditProduct = (productId) => {
    navigate('/MyShops/EditProduct/' + productId);
  };

  return (
    <div className="container mx-auto">
  <div className="overflow-x-auto">
    <h2 className="text-2xl font-bold mb-4">Product Table</h2>
    <div className="-my-2 py-2 overflow-x-auto">
  <div className="align-middle inline-block min-w-full shadow overflow-hidden rounded-lg border-b border-gray-200">
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider sm:px-6">Image</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider sm:px-6">Name</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider sm:px-6">Description</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider sm:px-6">Category</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider sm:px-6">Price</th>
          <th className="px-4 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider sm:px-6">Stock Quantity</th>
          <th colSpan={2} className="px-4 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider sm:px-6">action</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {currentProducts.map((product, index) => (
          <tr key={product.product_id} className="{{ index % 2 === 0 ? 'bg-gray-50' : 'bg-white' }}">
            <td className="px-4 py-4 whitespace-no-wrap text-sm leading-5 font-medium">
              <img src={product.image ? `${apiUrl}/uploads/${product.image.replace(/\\/g, "/")}` : null} alt={product.name} className="w-12 h-12 sm:w-20 sm:h-20 object-cover" />
            </td>
            <td className="px-4 py-4 whitespace-no-wrap text-sm leading-5 font-medium sm:px-6 sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">{product.name}</td>
            <td className="px-4 py-4 whitespace-no-wrap text-sm leading-5 font-medium sm:px-6 sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">{product.description}</td>
            <td className="px-4 py-4 whitespace-no-wrap text-sm leading-5 font-medium">{product.Category.name}</td>
            <td className="px-4 py-4 whitespace-no-wrap text-sm leading-5 font-medium">{product.price}</td>
            <td className="px-4 py-4 whitespace-no-wrap text-center text-sm leading-5 font-medium">{product.stock_quantity}</td>
            <td className="px-4 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
              <button className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 sm:px-5 sm:py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900" onClick={() => handleEditProduct(product.product_id)}>
               <FaEdit size={17}/>
              </button>
            </td>
            <td className="px-4 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
              <button className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 sm:px-5 sm:py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900" onClick={() => handleDeleteProduct(product.product_id)}>
                <MdDelete size={17}/>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    
    {/* Pagination */}
    <ul className="flex justify-center mt-4">
      {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
        <li key={index}>
          <button onClick={() => paginate(index + 1)} className={`px-3 py-1 mx-1 rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {index + 1}
          </button>
        </li>
      ))}
    </ul>
  </div>
</div>
  );
}

export default ListProduct;
