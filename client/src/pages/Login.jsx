import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { FormContainer } from'./style';
import {ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes'



const toastParam = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
}

const Login = () => {

  const navigate = useNavigate();
  
  const [values, setValues] = useState({
    username: "",
    password: ""
  });

  // useEffect(() => {
  //   if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
  //     navigate("/");
  //   }
  // }, [navigate])
  
  const handleSubmit = async(e) => {
      e.preventDefault();
      if(handleValidation()){
          const { username, password } = values;
          const { data } = await axios.post(loginRoute, { username, password});
          if(data.status === false) { toast.error(data.msg, toastParam); }
          if(data.status ===true ) {
            localStorage.setItem('chatty-users', JSON.stringify(data.user));
            navigate('/')
          }
      }
  }
  
  const handleChange =(e) => {
    setValues({...values, [e.target.name]: e.target.value })
  }

  const handleValidation = () => {
      const { username, password } = values;
      if(username === "" || password === ""){
        toast.error("Username and password must not be empty", toastParam); 
        return false;
      }
      return true;
  }

  return (
    <>
      <FormContainer>
          <form onSubmit={handleSubmit}>

              <div className="brand">
                <img src={Logo} alt="logo"/>
                <h1>chatty</h1>
              </div>

              <input 
                type="text" 
                placeholder='username' 
                name='username'
                required
                onChange={(e) => handleChange(e)}/>
              
              <input 
                type="password" 
                placeholder='password' 
                name='password'
                required
                onChange={(e) => handleChange(e)}/>
            
                <button type='submit'>Login</button>
                <span>
                  Don't have an account ?  <Link to="/register">Register</Link>
                </span>

          </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

export default Login;
