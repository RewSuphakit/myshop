import React from 'react'
import Carousel from '../../layouts/Carousel'
import Product from '../../layouts/Product'
import ProductDetails from '../../layouts/ProductDetails'
function UserProduct() {
  return (
    <div className="min-h-screen ">
      <div className="container mx-auto">
       <Carousel/>
       <Product />
       </div>
    </div>
  )
}

export default UserProduct
