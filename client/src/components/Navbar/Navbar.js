import React from 'react'
import './Navbar.css';
import logoimg from '../Dashboard/logo.jpg'

const Navbar = () => {
  return (
   <>
    <nav>
        
        <div className='nav_img_container'>
            <img src={logoimg}/>
        </div>
        
    </nav>
   </>
  )
}

export default Navbar
