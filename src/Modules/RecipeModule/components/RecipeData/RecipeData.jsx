import React from 'react'
import SectionHeader from '../../../Shared/components/SectionHeader/SectionHeader'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function RecipeData() {
  const [categoriesList,setCategoriesList]= useState([]);
  const [tagsList,setTagsList]= useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  const {id}=useParams();
  console.log(id);

  let{register,formState:{errors,isSubmitting}, reset,setValue,handleSubmit}= useForm();


  // -------formData-------
  const appendToFormData =(data)=>{
    const formData = new FormData();
    formData.append('name',data.name);
    formData.append('price',data.price);
    formData.append('description',data.description);
    formData.append('categoriesIds',data.categoriesIds);
    formData.append('tagId',data.tagId);

    // add image only if user selects new one
    if(data.recipeImage && data.recipeImage.length > 0){
      formData.append('recipeImage',data.recipeImage[0]);
    }

    return formData;
  }


  // -- function to make two operation (add and update recipe)
  let onSubmit =async(data)=>{

    let recipeData = appendToFormData(data);

    if(id){

      //----------------Update Recipe---------------
      try {
        let response = await axios.put(`https://upskilling-egypt.com:3006/api/v1/Recipe/${id}`, recipeData,
        {headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}}
        )
        toast.success('The Recipe updated successfully', {autoClose: 3000})
        navigate('/dashboard/recipes');
        
      } catch (error) {
        toast.error(error);
        console.log(error);
      }


    }else{
       // --------------Add Recipe -----------------
      try {
        let response = await axios.post('https://upskilling-egypt.com:3006/api/v1/Recipe/', recipeData,
        {headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}}
        )
        toast.success('The Recipe created successfully', {autoClose: 3000})
        navigate('/dashboard/recipes');
        
      } catch (error) {
        toast.error(error);
        console.log(error);
      }

    }

   
  }

  // Get recipeDetails
  const getRecipeDetails =async()=>{
    try{
      const response = await axios.get(`https://upskilling-egypt.com:3006/api/v1/Recipe/${id}`);
      // setRecipeDetails(response.data);
      // console.log(response.data);

      // reset(response.data)
      reset({
        name: response.data.name,
        price: response.data.price,
        description: response.data.description,
        tagId: response.data.tag?.id,
        categoriesIds: response.data.category?.[0]?.id,
      });
      if(response.data.imagePath){
        setPreviewImage(`https://upskilling-egypt.com:3006/${response.data.imagePath}`);
      }
    }catch(error){
      console.log(error);
    }
  }

 // --------getAllCategories------
  const getAllCategories =async()=>{
    try {
      let response = await axios.get('https://upskilling-egypt.com:3006/api/v1/Category/?pageSize=10&pageNumber=1',
      {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
      // console.log(response.data.data);
      setCategoriesList(response?.data?.data);
      
    } catch (error) {
      console.log(error);
    }
  }

  //------- Tags------------
  const getAllTags =async()=>{
    try {
      let response = await axios.get('https://upskilling-egypt.com:3006/api/v1/tag/?pageSize=10&pageNumber=1',
      {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
      // console.log(response?.data);
      setTagsList(response?.data);
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllCategories();
    getAllTags();

    if(id){
      getRecipeDetails();
    }

  },[])


  return (
    <>
     <SectionHeader title={id? "Update The Recipes":"Fill The Recipes !"} subtitle={"you can now fill the meals easily using the table and form , click here and sill it with the table !"}
      onButtonClick={()=> navigate('/dashboard/recipes')} buttonText={"All Recipes"}/>

      <form className='w-75 p-5 m-auto' onSubmit={handleSubmit(onSubmit)}>
      <input type="text" className="form-control my-2" placeholder="Recipe Name" aria-label="name"
       aria-describedby="basic-addon1"
       {...register('name',{required: 'Recipe Name is required'})}
       />
       {errors.name && <div className='text-danger'>{errors.name.message}</div>}

      <select  {...register('tagId',{required: 'Tags is required'})} className="form-control my-2">
       <option disabled>choose</option>
        {tagsList.map(tag =>
        <option key={tag?.id} value={tag?.id}>{tag?.name}</option>
          )}
      </select>
      {errors.tagId && <div className='text-danger'>{errors.tagId.message}</div>}

      <input type="number" className="form-control my-2" placeholder="Price" aria-label="price" 
      aria-describedby="basic-addon1"
      {...register('price',{required: 'Price is required'})}
      />
      {errors.price &&<div className='text-danger'>{errors.price.message}</div>}

      <select {...register('categoriesIds',{required:'categoriesIds is required'})} className="form-control my-2">
        <option disabled>choose</option>
      {categoriesList.map(category =>
        <option key={category?.id} value={category?.id}>{category?.name}</option>
          )}
      </select>

      <textarea className="form-control my-2" placeholder="Recipe description"
      {...register('description',{required: 'Recipe description is required'})}>   
      </textarea>
      {errors.description && <div className='text-danger'>{errors.description.message}</div>}

      <input type="file" className="form-control my-2" placeholder="Recipe file" aria-label="file" 
      aria-describedby="basic-addon1" 
      {...register('recipeImage',{
        onChange:(e)=> {
        const file = e.target.files[0];
        if(file){
          setPreviewImage(URL.createObjectURL(file));
          // setValue('recipeImage', e.target.files);
        }
      }
      })}
      />

      {previewImage && (
        <img src={previewImage} alt="preview" style={{width:'160px', height: '120px',
         objectFit:'cover',borderRadius:'8px', marginTop: '10px'}}/>
      )}

      <div className="btns d-flex justify-content-end my-4">
        <button disabled={isSubmitting} className={`btn btn-success mx-3 px-4 ${isSubmitting? "opacity-50":""}`}>Save</button>
        <button className='btn btn-outline-success mx-2 px-4' 
         onClick={()=> navigate('/dashboard/recipes')}>
          Cancel
        </button>
      </div>
        
      </form>
      
    </>
  )
}
