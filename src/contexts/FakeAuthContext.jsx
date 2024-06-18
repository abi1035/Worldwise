import { createContext, useContext, useReducer } from "react";

const AuthContext=createContext()

const initialState={
    user:null,
    isAuthenticated:false,
}

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };

function AuthProvider({children}){

    

    function reducer (state,action){
        switch (action.type) {
            case "login":
                
                return {...state, isAuthenticated:true, user:action.payload}
            
                case "logout":
                
                return {...state, isAuthenticated:false, user:null}
            default:
                throw new Error("There was an error")
        }
    }

    const [{user,isAuthenticated},dispatch]=useReducer(reducer,initialState)

    function login(email,password){
        if(email===FAKE_USER.email && password===FAKE_USER.password){
            dispatch({type:"login", payload:FAKE_USER})
        }
    }

    function logout(){
        dispatch({type:"logout"})
    }

    return <AuthContext.Provider value={
        {isAuthenticated,
        user,
        login,
        logout,}}>
        {children}
    </AuthContext.Provider>
}

function useAuth(){
    const context=useContext(AuthContext)

    if(context===undefined) throw new Error("Auth Context was used outside of Auth provider")

    return context
}

export {useAuth, AuthProvider}