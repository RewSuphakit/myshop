import React, { useState, useEffect } from "react";
import axios from "axios";


function ListProduct() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/products/");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleEditProduct = (productId) => {
    // นำไปยังหน้าแบบฟอร์มหรือโมดัลสำหรับการแก้ไข
    // ตัวอย่าง: การเปลี่ยนเส้นทางใน React Router
 
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Table</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>
                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover" />
              </td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock_quantity}</td>
              <td><button className="btn btn-sm btn-primary" onClick={() => handleEditProduct(product.product_id)}>Edit</button></td>
              <td><button className="btn btn-sm btn-secondary">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListProduct;
