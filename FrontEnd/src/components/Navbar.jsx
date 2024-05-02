import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const [nav, setNav] = useState(false)
  const handleClick = () => setNav(!nav)
  const handleClose = () => setNav(!nav)

  return (
    <div className='w-screen h-[80px] z-10 bg-zinc-200 drop-shadow-lg'>
      <div className='px-10 flex justify-between items-center w-full h-full'>
        <div className='flex items-center gap-5'>
          <h1 className='text-3xl font-bold mr-4 sm:text-4xl'>BorderPay</h1>
          <ul className='hidden md:flex gap-5'>
            <li><a href="/">Home</a></li>
            <li><a href="/signup" offset={-200}>Signup</a></li>
            <li><a href="/login" offset={-200}>Login</a></li>
            <li><a href="/create-contract" offset={-200}>Create Contract</a></li>
            <li><a href="/employee-list" offset={-200}>Employee List</a></li>
          </ul>
        </div>
        
      </div>
    </div>
  )
};

export default Navbar;