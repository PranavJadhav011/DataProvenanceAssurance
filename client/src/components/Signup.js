import React from 'react'
import { useState,useEffect } from 'react'
import {json, useNavigate} from 'react-router-dom'
import { Button, Form } from 'react-bootstrap';

import './styles/Signup.css'



export default function Signup() {

  let [name, setName] = useState();
  let [password, setPass] = useState();
  let [email, setEmail] = useState();
  let navigate = useNavigate();
   useEffect(()=>{
    const auth = localStorage.getItem('user');
    if(auth){
      navigate('/')
    }
  })


  async function submitForm(e){
    e.preventDefault();
    console.log(name, password, email);
    let result = await fetch('http://localhost:3500/register', {
      method: 'post',
      body: JSON.stringify({ name, email, password }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    result = await result.json();
    console.log(result);
    localStorage.setItem("user",JSON.stringify(result));
    if(result){
      navigate('/');
    }
  }

  return (
    <div className='Register'>
      <form onSubmit={submitForm}>
      <h3>Sign Up</h3>
        <input className='inputBox' type="text" placeholder='Enter Your Name' onChange={(e) => {
          setName(e.target.value);
        }} />
       
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
