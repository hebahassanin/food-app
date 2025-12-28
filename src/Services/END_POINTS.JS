import axios from "axios";


const baseURL ="https://upskilling-egypt.com:3006/api/v1";
export const ImageURL="https://upskilling-egypt.com:3006/";

export const axiosInstance = axios.create({
    baseURL,
    headers: {Authorization:localStorage.getItem('token')}
});


// ✅ interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

//--------------------------USERS------------------------
export const USERS_URL ={
    LOGIN: `/Users/Login`,
    REGISTER: `/Users/Register`,
    FORGET_PASS: `/Users/Reset/Request`,
    RESET_PASS: `/Users/Reset`,
    VERIFY: `/Users/verify`,
    CHANG_PASS: `/Users/ChangePassword`,

    GET_USERS:`/Users/`,
    DELETE_USERS:(id)=> `/Users/${id}`
}


//------------------------RECIPES-------------------------------
export const RECIPES_URL ={
    GET_RECIPES: `/Recipe/`,
    ADD_RECIPE: `/Recipe/`,
    GET_RECIPE_DETAILS:(id)=> `/Recipe/${id}`,
    UPDATE_RECIPE:(id)=>  `/Recipe/${id}`,
    DELETE_RECIPE:(id)=> `/Recipe/${id}`
}

//---------------------------User recipes----------
export const USER_RECIPE_URLS ={
    GET_FAVS: `/userRecipe/`,
    DELETE_FAVS: (id)=> `/userRecipe/${id}`,
    CREATE_FAVS: `/userRecipe/`,
}