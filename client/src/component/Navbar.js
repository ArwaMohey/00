import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Navbar.css'

function Navbar(){
    return (
        <div className='navbar'>
           <Link className='link' to='/'>Home</Link>
           <Link className='link' to='/doctors'>Doctors</Link>
           <Link className='link' to='/nutritionists'>Nutritionists</Link>
           <Link className='link' to='/appointments'>Appointments</Link>
           <Link className='link' to='/health-tracker'>Health Tracker</Link>
           <Link className='link' to='/chat'>Chat</Link>
           <Link className='link' to='/profile'>Profile</Link>
        </div>
    )
}

export default Navbar;