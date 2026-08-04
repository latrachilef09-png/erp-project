import axios from "axios";


const api = axios.create({

  baseURL: "http://localhost:3001",

});


api.interceptors.request.use((config)=>{

  if(typeof window !== "undefined"){

    const token = localStorage.getItem("token");

    if(token){

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