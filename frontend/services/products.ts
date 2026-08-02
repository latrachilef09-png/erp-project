import api from "@/lib/axios";


export interface Product {
  id: number;
  reference: string;
  name: string;
  minStock: number;
  categoryId: number;
}


export interface CreateProductDto {
  reference: string;
  name: string;
  minStock: number;
  categoryId: number;
}


export const productsService = {

  getAll: async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {

  const response = await api.get<Product[]>("/products", {
    params,
  });

  return response.data;
},


  getOne: async (id:number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },


  create: async (data:CreateProductDto) => {
    const response = await api.post<Product>(
      "/products",
      data
    );

    return response.data;
  },


  update: async (
    id:number,
    data:Partial<CreateProductDto>
  ) => {

    const response = await api.patch<Product>(
      `/products/${id}`,
      data
    );

    return response.data;
  },


  remove: async(id:number)=>{

    await api.delete(`/products/${id}`);

  }

};