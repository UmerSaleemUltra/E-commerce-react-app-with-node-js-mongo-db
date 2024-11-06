'use client'

import React, { useState, useEffect } from 'react'

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ title: '', description: '', price: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://ecommerce-website-backend-with-nod-js-and-mongodb.vercel.app/products/')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.data)
    } catch (error) {
      setError('Failed to fetch products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('https://ecommerce-website-backend-with-nod-js-and-mongodb.vercel.app/products/addproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })

      if (!response.ok) throw new Error('Failed to create product')

      const result = await response.json()
      if (result.message === 'Product added successfully!') {
        setProducts([...products, { ...newProduct, id: result.id }])
        setNewProduct({ title: '', description: '', price: '' })
        setError(null)
      }
    } catch (error) {
      setError('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Product Management</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex-1">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product List</h2>
          {loading && !products.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {products.map((product) => (
                <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products available</p>
          )}
        </div>
      </div>
    </div>
  )
}
