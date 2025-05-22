import React from 'react'
import { useProductStore } from '../store/useProductStore'
import type { Product } from '../types/products'

interface productListProps { 
    onEditProduct:  (product:Product) => void;
    onAddProduct: ()=> void;
}

const ProductList = ({onEditProduct, onAddProduct}:productListProps) => {
    const {searchTerm, setSortBy, setSearchTerm, deleteProduct,paginatedProducts,sortBy,totalPages,setCurrentPage,currentPage} = useProductStore()

    const handleDelete = (e:React.MouseEvent, productId:number) => {
        e.stopPropagation()
        deleteProduct(productId)
    }

  



  return (
    <div className='ProductListContainer'>
        <div className="search-bar">
             <button className='add-button' onClick={onAddProduct}>
              add product
            </button>
            <input type="text" className='search-input' placeholder='Search Products' onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm}/>
            <select className='sort-select' value={sortBy} onChange={(e)=> setSortBy(e.target.value as 'name' | 'price' | 'date')}>
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="date">Sort by Date</option>
            </select>
        </div>
        
      <ul className='products-list'>
    {paginatedProducts().map((product) => (
         <li key={product.id} className='product-item' onClick={()=> onEditProduct(product)}>
         {/* <img src={product.imgUrl} alt={product.name} className='product-image'/> */}
         <div style={{width:'25px',height:'25px',backgroundColor:'grey'}}></div>
         <div className='product-description'>
             <h3 className='product-title'>{product.name}</h3>
             <p className='product-description'>{product.description}</p>
         </div>
         <button className='delete-button' onClick={(e)=>handleDelete(e, product.id)}>
            Delete item - X
         </button>
     </li>
    ))}
      </ul>

      {totalPages() > 1 && (

        <div className='pagination'>
            <button className='page-button' disabled={currentPage === 1} onClick={()=>setCurrentPage(currentPage - 1)}>Previous</button>
            <div className='page-info'>Page {currentPage} of {totalPages()}</div>
            <button className='page-button' disabled={currentPage === totalPages()} onClick={()=>setCurrentPage(currentPage + 1)}>Next</button>

        </div>
      )}
    </div>
  )
}

export default ProductList
