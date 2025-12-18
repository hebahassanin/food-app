import React from 'react'
import Header from '../../../Shared/components/Header/Header'
import headerImg1 from '../../../../assets/images/headerImgs/header1.svg'
import { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';

import { IoIosSearch } from "react-icons/io";
import DotLoader from 'react-spinners/DotLoader';

export default function RecipesList() {

  const [recipesList, setRecipesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllRecipes =async()=>{

    try {
      setLoading(true);
      let response = await axios.get('https://upskilling-egypt.com:3006/api/v1/Recipe/?pageSize=10&pageNumber=1',
    {headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}});
    console.log(response.data.data);

    setRecipesList(response.data.data);
      
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    getAllRecipes();
  },[])

  return (
    <>
    <Header title={'Recipes Items'} description={'You can now add your items that any user can order it from the Application and you can edit'} imgUrl={headerImg1}/>
     
    <div className="recipes-container m-3 d-flex justify-content-between align-items-center p-4 rounded-3">
      <div className="caption">
        <h4>Recipe Table Details</h4>
        <p>You can check all details</p>
      </div>
      <button className='btn btn-success'>Add New Recipes</button>
    </div>

    <div className='search-container d-flex align-items-center gap-3 m-3'>
        <div className="input-group">
          <span className="input-group-text">
          <IoIosSearch />
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Search..."
          />
        </div>

        <select defaultValue='1' className="form-select form-select-sm w-auto" aria-label="Small select example">
          <option value='1'>Tag</option>
          <option value="2">One</option>
          <option value="3">Two</option>
          <option value="4">Three</option>
        </select>

        <select defaultValue='1' className="form-select form-select-sm w-auto" aria-label="Small select example">
          <option value='1'>Category</option>
          <option value="2">One</option>
          <option value="3">Two</option>
          <option value="4">Three</option>
        </select>

    </div>
   

    <table className="table table-striped m-3">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Recipe Name</th>
            <th scope="col">Recipe Image</th>
            <th scope="col">Price</th>
            <th scope="col">Description</th>
            <th scope="col">Tag</th>
            <th scope="col">Category</th>
          </tr>
        </thead>
        <tbody>
          { loading ?(
            <tr>
              <td colSpan="7" className='text-center py-4'>
                <div className='d-flex justify-content-center align-items-center'>
                <DotLoader color="#0b4f0b" />
                </div>
              </td>
            </tr>)
         : recipesList.map(recipe=>(
            <tr key={recipe?.id}>
            <th scope="row">{recipe.id}</th>
            <td>{recipe?.name}</td>
            <td><img style={{height: '60px',width:'80px'}} src={`https://upskilling-egypt.com:3006/${recipe?.imagePath}`}/></td>
            <td>{recipe?.price}</td>
            <td>{recipe?.description}</td>
            <td>{recipe?.tag.name}</td>
            <td>{recipe?.category.map(cat=>(
               <div key={cat?.id}>
              {cat?.name}
              </div>
            ))}</td>
          </tr>


          ))}
          
            
          
        </tbody>
      </table>

    </>
  )
}
