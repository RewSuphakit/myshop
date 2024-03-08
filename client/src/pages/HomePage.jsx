import React from 'react'
import Carousel from '../layouts/Carousel'
import Product from '../layouts/Product'
import ProductNew from '../layouts/productNew'

function HomePage() {
  return (
    <div>
      <div className=" container mx-auto">
      <Carousel/>
      </div>
      <Product/>
    </div>
  )
}

export default HomePage
