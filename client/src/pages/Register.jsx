import React, {  useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { FormContainer } from'./style';
import {ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes'



const toastParam = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
}

const Register = () => {

  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  
  useEffect(() => {
    let isMounted = true;
    if(isMounted){
      if(localStorage.getItem('chatty-users')){
        navigate('/');
      }
    }
    return () => { isMounted = false }
  }, [navigate])

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(handleValidation()){
        const { username, email, password } = values;
        const { data } = await axios.post(registerRoute, {username, email, password});
        if(data.status === false) toast.error(data.msg, toastParam)
        if(data.status ===true ) {
          toast.success(data.status, toastParam);
          localStorage.setItem('chatty-users', JSON.stringify(data.user))
          navigate('/')
        }
    }
  }
  
  const handleChange =(e) => {
    setValues({...values, [e.target.name]: e.target.value })
  }

   function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if(password.trim() !== confirmPassword.trim()){
      toast.error("Password match error!", toastParam); return false;
    }else if(username.length < 3){
       toast.error("Username must be above 4 character", toastParam); return false;
    }else if(!isValidEmail(email)){
       toast.error("Email is invalid", toastParam); return false;
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
                type="email" 
                placeholder='Email' 
                name='email'
                required
                onChange={(e) => handleChange(e)}/>
              <input 
                type="password" 
                placeholder='password' 
                name='password'
                required
                onChange={(e) => handleChange(e)}/>
              <input 
                type="password" 
                placeholder='Confirm password' 
                name='confirmPassword'
                required
                onChange={(e) => handleChange(e)}/>
                <button type='submit'>Create User</button>
                <span>
                  Already have an account ?  <Link to="/login">Login</Link>
                </span>
          </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

export default Register;
