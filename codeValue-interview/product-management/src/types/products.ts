export interface Product {
    id : number;
    name: string;
    description?: string;
    price: number;
    imgUrl?: string;
    creationDate: Date;
}

export interface ProductFormData {
    name: string;
    description?: string;
    price: number;
}

export interface ProductFormDataErrors {
    name: string;
    description: string;
    price: string;
}
