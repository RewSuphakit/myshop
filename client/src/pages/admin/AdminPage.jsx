import React from 'react'
import Navbar from './Navbar'
import AddProductForm from './addProductForm'
function AdminPage() {
  return (
    <div className="container mx-auto">
      <Navbar />
      <AddProductForm/>
    </div>
  )
}

export default AdminPage
