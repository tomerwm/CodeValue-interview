import React, { useEffect, useState } from 'react'
import type { Product, ProductFormData, ProductFormDataErrors } from '../types/products';
import { useProductStore } from '../store/useProductStore';

interface ProductFormProps { 
    open: boolean;
    onClose: ()=> void;
    product?: Product;
}

const ProductForm = ({open, onClose, product}: ProductFormProps) => {
    const {addProduct, updateProduct} = useProductStore()
    const [formData, setFormData] = useState<ProductFormData>({
        name:"",
        description:"",
        price: 0,
    })

    useEffect(()=>{
        if(product){
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price
            })
        }else{
            setFormData({
                name:'',
                description:'',
                price:0
            })
        }
    },[product])

    const validateForm = (): boolean => {
        const newErrors: Partial<ProductFormDataErrors> = {}
        if(!formData.name.trim()){
            newErrors.name = 'Name is required'
        }else if (formData.name.length > 30){
            newErrors.name = 'Name must be less then 30 characters'
        }

        if(formData.description && formData.description.length > 200){
            newErrors.description = 'Description must be less then 200 characters'
        }

        if(formData.price <= 0){
            newErrors.price = 'Price must be greater then 0'
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 

    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(!validateForm()) return
        if(product){
            updateProduct(product.id, formData)
        }else{
            addProduct(formData)
        }
        onClose()
    }

    const [errors, setErrors] = useState<Partial<ProductFormDataErrors>>({})

    if (!open) return null;

  return (
    <div className='ProductFormContainer' onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        <h2 className='modal-title'>{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="form-group">
            <div className="form-field">
                <label htmlFor="name" className='form-label'>Name</label>
                <input 
                  type="text"
                  id="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData ,name:e.target.value})}
                  required
                />
                {errors.name && <span className='error-text'>{errors.name}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="description" className='form-label'>Description</label>
                <textarea 
                  rows={3}
                  id="description"
                  className={`form-input ${errors.description ? 'error' : ''}`}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData ,description: e.target.value})}
                />
                {errors.description && <span className='error-text'>{errors.description}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="price" className='form-label'>price</label>
                <input 
                  type="text"
                  id="price"
                  className={` ${errors.price ? 'error' : ''}`}
                  value={formData.price}
                  onChange={(e) => setFormData({...formData ,price: Number(e.target.value)})}
                  required
                />
                {errors.price && <span className='error-text'>{errors.price}</span>}
            </div>

            <div className='form-buttons'>
                <button type='button' className='primary-button' onClick={onClose}>
                    Cancel
                </button>
                <button type='submit' className='secondary-button'>
                    {product ? 'Save' : 'Add'}
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
