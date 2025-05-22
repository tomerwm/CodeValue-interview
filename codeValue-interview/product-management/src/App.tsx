import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import ProductList from './components/ProductList'
import type { Product } from './types/products'
import ProductForm from './components/ProductForm'
 
function App() {
const [isFromOpen, setIsFormOpen] = useState(false)
const [setlectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)

const handleAddClick = ()=> {
  setSelectedProduct(undefined)
  setIsFormOpen(true)
} 

const handleEditProduct = (product:Product)=> {
  setSelectedProduct(product);
  setIsFormOpen(true);
}

const handleCloseForm = ()=> {
  setIsFormOpen(false)
  setSelectedProduct(undefined)
}

  return (
    <>
      <Navbar/>
      <div className="list-wrapper">
            <ProductList onEditProduct={handleEditProduct} onAddProduct={handleAddClick}/>
            <ProductForm onClose={handleCloseForm} open={isFromOpen} product={setlectedProduct}/>
      </div>
    </>
  )
}

export default App
