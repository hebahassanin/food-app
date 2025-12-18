import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AuthLayout from './Modules/Shared/components/AuthLayout/AuthLayout';
import NotFound from './Modules/Shared/components/NotFound/NotFound';
import Login from './Modules/AuthModule/components/Login/Login';
import Register from './Modules/AuthModule/components/Register/Register';
import ForgetPassword from './Modules/AuthModule/components/ForgetPassword/ForgetPassword';
import ResetPassword from './Modules/AuthModule/components/ResetPassword/ResetPassword';
import VerifyAccount from './Modules/AuthModule/components/VerifyAccount/VerifyAccount';
import MasterLayout from './Modules/Shared/components/MasterLayout/MasterLayout';
import Dashboard from './Modules/DashboardModule/components/Dashboard/Dashboard';
import RecipesList from './Modules/RecipeModule/components/RecipesList/RecipesList';
import RecipeData from './Modules/RecipeModule/components/RecipeData/RecipeData';
import CategoriesList from './Modules/CategoriesModule/components/CategoriesList/CategoriesList';
import CategoryData from './Modules/CategoriesModule/components/CategoryData/CategoryData';
import UsersList from './Modules/UsersModule/components/UsersList/UsersList';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Modules/Shared/components/ProtectedRoute/ProtectedRoute';

function App() {

  const routes = createBrowserRouter(
    [
      {
        path:"",
        element:<AuthLayout/>,
        errorElement:<NotFound/>,
        children:[
          {index:true,element:<Login/>},
          {path:"login",element:<Login/>},
          {path:"register",element:<Register/>},
          {path:"forget-pass",element:<ForgetPassword/>},
          {path:"reset-pass",element:<ResetPassword/>},
          {path:"verify-account",element:<VerifyAccount/>}
        ]
      },
      {
        path:"dashboard",
        element:<ProtectedRoute><MasterLayout/></ProtectedRoute>,
        errorElement:<NotFound/>,
        children:[
          {index:true, element:<Dashboard/>},
          {path:"recipes",element:<RecipesList/>},
          {path:"recipe-data",element:<RecipeData/>},
          {path:"categories",element:<CategoriesList/>},
          {path:"category-data",element:<CategoryData/>},
          {path:"users",element:<UsersList/>},
        ]
      }
    ])

  return (
    <>
    <RouterProvider router={routes}></RouterProvider>
    <ToastContainer />
    
    </>
  )
}

export default App
