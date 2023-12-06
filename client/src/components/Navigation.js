import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './styles/Navigation.css'

export default function Navigation() {
  const auth = localStorage.getItem('user');
  const navigation = useNavigate();
  const logout = () => {
    console.log("logging out");
    localStorage.clear();
    navigation('/signup')
  }
  return (
    <div className='nav'>
      <div className='navIn'>
      {auth ? <ul className='nav-bar'>
        <li> <Link to='/'>Home</Link>  </li>
        <li> <Link to='/add'>Add File</Link>  </li>
        <li> <Link to='/check'>Check Provenance</Link>  </li>
        <li><Link onClick={logout} to='/signup'>Logout({JSON.parse(auth).name})</Link>
        </li>
      </ul> :
        <ul className='nav-bar-right'>
          <li><Link to='/signup'>Sign Up</Link></li>
          <li><Link to='/login'>Login</Link></li>
        </ul>}
        </div>
    </div>
  )
}
