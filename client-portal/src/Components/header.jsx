import React, { useState, useEffect } from 'react';
import ThemeSwitcher from './themeSwitcher';
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
 import { Dropdown } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import ChangeGeoLang from '../clientpages/Modals/ChangeGeoLang';
import ChangePassword from '../clientpages/Modals/ChangePassword';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Tracks the open submenu
  const [selected, setselected] = useState("#0");
  const { decryptData } = useAuth()
  const DispalyName = decryptData().firstname
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ispassModalOpen, setispassModalOpen] = useState(false);
  const closePassModal = () => setispassModalOpen(false);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {

    const path = window.location.pathname;
    checkPath(path);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('user'); // Remove the user from localStorage
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.reload(); // Reload the page or redirect to the login page
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu); // Toggle current menu, close others
  };

  const checkPath = (path) => {
    if (path === "/core-tracking") {
      changeselected("#1");
    } else if (path === "/map-tracking") {
      changeselected("#2");
    } else if (path === "/messages") {
      changeselected("#3");
    } else if (path === "/point-of-intrest") {
      changeselected("#4");
    } else if (path === "/Reports") {
      changeselected("#5");
    } else if (path === "/fleet-management") {
      changeselected("#6");
    } else if (path === "/maintanace-management") {
      changeselected("#7");
    } else if (path === "/support-center") {
      changeselected("#8");
    } else if (path === "/asset-info") {
      changeselected("#9");
    }
  };


  const changeselected = (btn) => {
    setselected(btn); // Toggle current menu, close others
  };

  const items = [
    {
      key: '1',
      label: (
        <a onClick={()=>setIsModalOpen(true)}>
          Geolocation Language
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a onClick={()=>setispassModalOpen(true)}>
          Change Password 
        </a>
      ),
    },
  ];
  return (
    <>
        {isModalOpen === true ? (<ChangeGeoLang open={isModalOpen} onClose={closeModal} />) : null}
        {ispassModalOpen === true ? (<ChangePassword open={ispassModalOpen} onClose={closePassModal} />) : null}
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-600 text-white transition-shadow ${isScrolled
          ? 'border-b border-gray-200 dark:border-gray-800 shadow-md'
          : ''
          } bg-white dark:bg-[#1b1b1d]`}
      >
        {/* Left Corner: Drawer Toggle Button */}
        <div className="flex items-center">
          <button
            onClick={toggleDrawer}
            className=" dark:hover:bg-[#28282a] hover:bg-gray-200 text-black dark:text-white  px-4 py-2 rounded mr-4"
          >
            ☰
          </button>
          <img
            src="/assets/trak24comtr.png"
            alt="Left Logo"
            className="h-8 dark:hidden"
          />
          <img
            src="/assets/trak24comtrw.png"
            alt="Left Logo"
            className="h-8 hidden dark:block"
          />
        </div>

        {/* Center: Another Logo */}
        {/* <div className="hidden md:flex items-center">
          <img src="/assets/trak24comtrw.png" alt="Center Logo" className="h-8" />
        </div> */}

        {/* Right Corner: Buttons */}
        <div className="flex items-center space-x-3">
          <h1 className=' text-lg text-black dark:text-white'>Hi, {DispalyName}</h1>
          <ThemeSwitcher />
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            arrow={{
              pointAtCenter: true,
            }}
          >
            <a className="p-2  hover:bg-gray-100 dark:hover:bg-[#28282a] rounded-full cursor-pointer" title='Settings'>
              <IoSettingsOutline className=' text-black dark:text-white size-7' /></a>
          </Dropdown>

          <a className="p-2  hover:bg-gray-100 dark:hover:bg-[#28282a] rounded-full cursor-pointer" title='Logout'>
            <IoIosLogOut onClick={logout} className=' text-black dark:text-white size-8' />
          </a>
        </div>
      </header>

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#1b1b1d] shadow-lg z-40 transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ width: '300px' }}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-800">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={toggleDrawer}
              className="text-gray-600 dark:text-gray-400"
            >
              ✕
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="space-y-1 mt-5">
            {/* Simple Menu Items */}

            <div onClick={() => { navigate("/home"); changeselected("#0"); }} className={`cursor-pointer ${selected === "#0" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Home
              </a>
            </div>

            <div
              onClick={() => { navigate("/core-tracking"); changeselected("#1"); }}
              className={`cursor-pointer ${selected === "#1" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 cursor-pointer dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}
            >
              <a className="block text-gray-800 dark:text-gray-200">
                Core Tracking
              </a>
            </div>

            <div onClick={() => { navigate("/map-tracking"); changeselected("#2"); }} className={`cursor-pointer ${selected === "#2" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Map Tracking
              </a>
            </div>

            {/* <div onClick={() => { navigate("/messages"); changeselected("#3"); }} className={`cursor-pointer ${selected === "#3" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Messages
              </a>
            </div> */}

            <div onClick={() => { navigate("/point-of-intrest"); changeselected("#4"); }} className={`cursor-pointer ${selected === "#4" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Point of Intrest
              </a>
            </div>

            <div onClick={() => { navigate("/Reports"); changeselected("#5"); }} className={`cursor-pointer ${selected === "#5" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Reports
              </a>
            </div>

            {/* <div onClick={() => { navigate("/fleet-management"); changeselected("#6"); }} className={`cursor-pointer ${selected === "#6" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Fleet Management
              </a>
            </div>

            <div onClick={() => { navigate("/maintanace-management"); changeselected("#7"); }} className={`cursor-pointer ${selected === "#7" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Maintanace Management
              </a>
            </div> */}

            <div onClick={() => { navigate("/support-center"); changeselected("#8"); }} className={`cursor-pointer ${selected === "#8" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Support Center
              </a>
            </div>

            <div onClick={() => { navigate("/assets-info"); changeselected("#9"); }} className={`cursor-pointer ${selected === "#9" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#28282a] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Asset Info
              </a>
            </div>

            {/* <div>
              <button
                onClick={() => { toggleSubmenu('settings'); changeselected("#3"); }}
                className={`${selected === "#3" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} flex items-center justify-between w-72 dark:hover:bg-[#28282a] hover:bg-gray-100 mr-4 p-3 rounded-tr-2xl rounded-br-2xl`}
              >
                Settings
                <span>{openSubmenu === 'settings' ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
              </button>
              <div
                className={`transition-[max-height] duration-300 overflow-hidden ${openSubmenu === 'settings' ? 'max-h-40' : 'max-h-0'
                  }`}
              >
                <div>
                  <div onClick={() => changeselected("#4")} className={`${selected === "#4" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a href="#" className="block ">
                      FAQ
                    </a>
                  </div>

                  <div onClick={() => changeselected("#5")} className={`${selected === "#5" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a href="#" className="block ">
                      Contact
                    </a>
                  </div>

                  <div onClick={() => changeselected("#6")} className={`${selected === "#6" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a href="#" className="block ">
                      Feedback
                    </a>
                  </div>
                </div>
              </div>
            </div>
\
            <div>
              <button
                onClick={() => { toggleSubmenu('support'); changeselected("#7"); }}
                className={`${selected === "#7" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} flex items-center justify-between w-72 dark:hover:bg-[#343A46] hover:bg-gray-100 mr-4 p-3 rounded-tr-2xl rounded-br-2xl`}
              >
                Support
                <span>{openSubmenu === 'support' ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
              </button>
              <div
                className={`transition-[max-height] duration-300 overflow-hidden ${openSubmenu === 'support' ? 'max-h-40' : 'max-h-0'
                  }`}
              >
                <div>
                  <div onClick={() => changeselected("#8")} className={`${selected === "#8" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 w-72 dark:hover:bg-[#343A46] p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a href="#" className="block ">
                      FAQ
                    </a>
                  </div>

                  <div onClick={() => changeselected("#9")} className={`${selected === "#9" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 w-72 dark:hover:bg-[#343A46] p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a href="#" className="block ">
                      Contact
                    </a>
                  </div>

                  <div onClick={() => changeselected("#10")} className={`${selected === "#10" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 w-72 dark:hover:bg-[#343A46] p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a href="#" className="block ">
                      Feedback
                    </a>
                  </div>
                </div>
              </div>
            </div> */}

            <div onClick={logout} className='hover:bg-gray-100 w-72 p-3 cursor-pointer dark:hover:bg-[#343A46] justify-center rounded-tr-2xl rounded-br-2xl'>
              <a className="block text-gray-800 dark:text-gray-200">
                Logout
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleDrawer}
        ></div>
      )}
    </>
  );
};

export default Header;
