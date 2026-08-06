import axios from "axios";


const api = axios.create({

  baseURL: "http://localhost:3001",

});


api.interceptors.request.use((config)=>{

  if(typeof window !== "undefined"){

    const token = localStorage.getItem("token");

    if(token){

  console.log("TOKEN SENT:", token);

  config.headers.Authorization =
    `Bearer ${token}`;

}

  }


  return config;

});



api.interceptors.response.use(

(response)=>response,


(error)=>{

  if(error.response?.status === 401){

  console.log("401 ERROR:", error.response.data);

}


  return Promise.reject(error);

}

);



export default api;
export async function getInventoryCounts() {
  const response = await api.get("/inventory-counts");
  return response.data;
}


export async function getInventoryCount(id: number) {
  const response = await api.get(`/inventory-counts/${id}`);
  return response.data;
}


export async function createInventoryCount(data: any) {
  const response = await api.post("/inventory-counts", data);
  return response.data;
}


export async function updateCountLine(
  lineId: number,
  data: any,
) {
  const response = await api.patch(
    `/inventory-counts/line/${lineId}`,
    data,
  );

  return response.data;
}


export async function validateInventoryCount(id: number) {
  const response = await api.patch(
    `/inventory-counts/${id}/validate`,
  );

  return response.data;
}