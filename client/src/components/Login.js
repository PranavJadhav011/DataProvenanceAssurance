import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';


import './styles/Signup.css'

export default function Login() {
    let [password, setPass] = useState();
    let [email, setEmail] = useState();
    let navigate = useNavigate();
    
    useEffect(()=>{
        const auth = localStorage.getItem("user");
        if(auth){
            navigate("/");
        }
    })
    
    
    const submitForm = async (e)=>{
        e.preventDefault();
        let result = await fetch("http://localhost:3500/login",{
            method:'post',
            body:JSON.stringify({email,password}),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        console.log(result);
        if(result.name){
            localStorage.setItem("user",JSON.stringify(result));
            navigate("/");
        }
        else{
            alert("please enter correct details");
        }
    }

  return (
    <div className='Register'>
      <form onSubmit={submitForm}>
      <h3>Sign In</h3>
      <input className='inputBox' type="email" placeholder='Enter Your email' onChange={(e) => {
          setEmail(e.target.value);
        }} />
        <input className='inputBox' type="password" placeholder='Enter Your Password' onChange={(e) => {
          setPass(e.target.value);
        }} />
       
        <button className='submitBtn' >Submit</button>
      </form>
    </div>
  )
}
