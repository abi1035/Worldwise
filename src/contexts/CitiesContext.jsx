import { createContext, useContext,useState,useEffect, useReducer } from "react"

const BASE_URL="http://localhost:3000"

const CitiesContext=createContext()

function CitiesProvider({children}) {

function reducer(state,action){

  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading:true,
      }


    case "cities/loaded":
      return {
        ...state,
        isLoading:false,
        cities:action.payload
      }


    case "currentCity/loaded":
      return {
        ...state,
        isLoading:false,
        currentCity:action.payload
        }

    case "city/created":
      return {
        ...state,
        isLoading:false,
        cities:[...state.cities, action.payload],
        currentCity:action.payload
        }
    
  
    
    case "city/delete":

    return {
      ...state,
      isLoading:false,
      cities: state.cities.filter(city=>city.id!==action.payload),
      currentCity:{}

      }
      

    case "rejected":
      return {
        ...state,
        isLoading:false,
        error:action.payload
      }
    

    default:
      throw new Error("Unkonw break statement")
      
  }
}

const initialState={
  cities:[],
  isLoading:false,
  currentCity:{},
  error:""
}



// const [cities,setCities]=useState([])
// const [isLoading,setIsLoading]=useState(false)
// const[currentCity,setCurrentCity]=useState({})

const [{cities,isLoading,currentCity,error},dispatch]=useReducer(reducer,initialState)  

useEffect(function(){
  async function fetchCities(){

    dispatch({type:"loading"})

    try {
      
      const res= await fetch(`${BASE_URL}/cities`);
    const data= await res.json();

      dispatch({type:"cities/loaded",payload:data})

  }catch (err){
    dispatch({type:"rejected",payload:"There was an error loading data"})
  } 
  
}
fetchCities();
},[])

async function getCity(id){
if(id==currentCity.id) return;

  dispatch({type:"loading"})
  
    try {
      const res= await fetch(`${BASE_URL}/cities/${id}`);
    const data= await res.json();
    dispatch({type:"currentCity/loaded",payload:data})
    
  }catch (err){
    dispatch({type:"rejected",payload:"There was an error loading data"})

  }
}


async function createCity(newCity){
  dispatch({type:"loading"})

  
  try {
    
    const res= await fetch(`${BASE_URL}/cities` ,{
      method:"POST",
      body:JSON.stringify(newCity),
      headers:{
        "Content-Type":"application/json",
      }
    });
  const data= await res.json();

  dispatch({type:"city/created",payload:data})
  
}catch (err){
  dispatch({type:"rejected",payload:"There was an error loading data"})

}
}

async function deleteCity(id){
  dispatch({type:"loading"})

  
  try {
    
    await fetch(`${BASE_URL}/cities/${id}` ,{
      method:"DELETE",
      
    });
  
    dispatch({type:"city/delete",payload:id})

  
  
}catch (err){
  dispatch({type:"rejected",payload:"There was an error loading data"})

} 
}



    return (
        <>
         <CitiesContext.Provider value={{
            cities,
            isLoading,
            error,
            currentCity,
            getCity,
            createCity,
            deleteCity,
         }}>
            {children}
         </CitiesContext.Provider>   
        </>
    )
}

function useCities(){
    const context=useContext(CitiesContext)
    if(context===undefined) 
    throw new Error("Cities Context was used outside the cities provider")
    return context;
    
}

export  {CitiesProvider, useCities}
