import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CiCloudMoon } from "react-icons/ci";
import { PiCloudSun } from "react-icons/pi";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className="p-2  hover:bg-gray-100 dark:hover:bg-[#343A46] rounded-full cursor-pointer"
    >    {theme === 'light' ? <CiCloudMoon className='text-black size-8'/> : <PiCloudSun className=' size-8'/>} 
    </div>




  );
};

export default ThemeSwitcher;
