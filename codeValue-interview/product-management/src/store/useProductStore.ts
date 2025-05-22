import { create } from 'zustand';
import type { Product, ProductFormData } from '../types/products';

interface ProductStore { 
    //Product state
    products: Product[];
    searchTerm: string;
    sortBy: 'name' | 'price' | 'date',
    

    //Product actions
    setSearchTerm: (term: string) => void,
    setSortBy : (sortBy:  'name' | 'price' | 'date')=> void,
    addProduct: (product: ProductFormData) => void,
    updateProduct: (id:number, product:ProductFormData) => void,
    deleteProduct: (id:number) => void,
    filteredProducts:() => Product[],
    totalPages:() => number,
    paginatedProducts:()=> Product[];
    setCurrentPage:(page:number) =>void;


    //Pagination
    currentPage:number;
    producstPerPage:number;

    
}

const initialproducts: Product[] = [
        {
            id: 1,
            name:'product1',
            description: 'product 1 description',
            price: 11,
            imgUrl:'https://placehold.co/600x400.png',
            creationDate: new Date(),
            
        },
        {
            id: 2,
            name:'product2',
            description: 'product 2 description',
            price: 22,
            imgUrl:'https://placehold.co/600x400.png',
            creationDate: new Date(),
            
        },
        {
            id: 3,
            name:'product3',
            description: 'product 3 description',
            price: 33,
            creationDate: new Date(),
            
        },
        {
            id: 4,
            name:'product4',
            description: 'product 4 description',
            price: 44,
            imgUrl:'https://placehold.co/600x400.png',
            creationDate: new Date(),
            
        },
        {
            id: 5,
            name:'product5',
            description: 'produc 5 description',
            price: 55,
            imgUrl:'https://placehold.co/600x400.png',
            creationDate: new Date(),
            
        },
]

const loadProducts = (): Product[] => {
    try {
        const stored = localStorage.getItem('products')
        if(!stored) return initialproducts
        const parsedData = JSON.parse(stored)
            return parsedData.map((p: any) => ({
                ...p,
                creationDate:new Date(p.creationDate)
            }))
    } catch (error) {
        console.error('error loading products' ,error)
        return initialproducts
    }
};

const saveProducts = ((products:Product[])=>{
    try{
        localStorage.setItem('products',JSON.stringify(products))
    }catch(error){
        console.error('Error saving products to the local storage',error)
    }
})

export const useProductStore = create<ProductStore> ((set, get) => ({
    products: loadProducts(),
    searchTerm:'',
    sortBy:'name',
    currentPage:1,
    producstPerPage:5,

    setSearchTerm: (term)=> set({ searchTerm: term ,currentPage:1}),

    setSortBy: (sortBy)=> set({ sortBy }),

    addProduct: (productData)=> set((state)=> {
        const newProduct: Product= { 
            ...productData,
            id: Math.max(0, ...state.products.map(p => p.id)) + 1,
            creationDate: new Date()
        };
        const newProducts = [...state.products, newProduct];
        saveProducts(newProducts)
        return {products: newProducts, currentPage:1};
    }),

    updateProduct:(id, productData) => set((state)=> {
        const newProduct = state.products.map(product => product.id === id ? {...product, ...productData} : product)
        saveProducts(newProduct)
        return {products: newProduct}
    }),

    deleteProduct: (id) => set((state) => {
        const newProducts = state.products.filter(product => product.id !== id)
        const totalPages = Math.ceil(newProducts.length / state.producstPerPage)
        const newCurrentPage = Math.min(state.currentPage, totalPages || 1)

        saveProducts(newProducts)
        return {products: newProducts, currentPage:newCurrentPage}
    }),

    filteredProducts:()=>{
        const {products, searchTerm, sortBy} = get();
        return products.filter(product => product.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) || 
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a,b)=>{
           switch (sortBy) {
               case 'name':
                   return a.name.localeCompare(b.name)
               case 'price':
                   return a.price - b.price 
               case 'date':
                   return  a.creationDate.getTime() - b.creationDate.getTime()                  
               default:
                   return 0;
           }
        })
    },
    totalPages:()=>{
        const {producstPerPage} = get();
        const filtered = get().filteredProducts();
        return Math.ceil(filtered.length / producstPerPage);
    },

    paginatedProducts:()=>{
        const {currentPage, producstPerPage} = get();
        const filtered = get().filteredProducts();
        const startIndex = (currentPage - 1 ) * producstPerPage;
        const endIndex = startIndex + producstPerPage;
        return filtered.slice(startIndex,endIndex)
    },

    setCurrentPage:(page)=> set({currentPage:page})

}))