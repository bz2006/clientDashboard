import React, { useEffect, useState } from 'react';
import { BsGlobe2, BsPersonFill, BsLockFill } from "react-icons/bs";
import { FiLogIn } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import ThemeSwitcher from './Components/themeSwitcher';
import {message}from"antd"
import axios from "axios"
import { useSearchParams } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const { encryptData } = useAuth()
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = "/home"
        }

        const data = JSON.parse(searchParams.get("data"))
        if (data) {
            HandleAdminLogin(data)
        }
    }, []);


    const UpdateUsage = async () => {
        try {
            await axios.post(`/api-trkclt/update-webusage`);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const HandleAdminLogin = async (d) => {
        try {
            setLoading(true);
            const response = await axios.post("/api-trkclt/admcl-login", { admid: d.admid, clid: d.clid })
            if (response.status === 200) {
                localStorage.setItem('token', response.data?.token)
                localStorage.setItem('user', response.data?.data.userId)
                encryptData({ id: response.data?.data.userId, name: response.data?.data.name, firstname: response.data?.data.firstname, company: response.data?.data.company })
                window.location.href = "/home"
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const HandleLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api-trkclt/cp-login", {
                "username": username,
                "password": password
            })

            if (response.status === 200) {
                if (response.data?.data.webp === true) {
                    await Promise.all([
                        UpdateUsage(),
                        localStorage.setItem('token', response.data?.token),
                        localStorage.setItem('user', response.data?.data.userId),
                        encryptData({ id: response.data?.data.userId, name: response.data?.data.name, firstname: response.data?.data.firstname, company: response.data?.data.company })
                    ]);
                    window.location.href = "/home"
                }
            }
        } catch (error) {
            console.error(error)
            message.error("Login Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Header - Kept unchanged as requested */}
            <header
                className={`fixed top-0 w-full z-50 flex items-center justify-between p-3 text-white transition-shadow`}
            >
                <div className="flex items-center">
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

                <div className="flex items-center space-x-4">
                    <ThemeSwitcher />
                    <a
                        href='https://www.trak24.in'
                        className="p-2 hover:bg-gray-100 dark:hover:bg-[#343A46] rounded-full"
                    >
                        <BsGlobe2 className='text-black dark:text-white text-xl' />
                    </a>
                </div>
            </header>

            {/* Light Theme Login */}
            <section
                className="h-screen flex flex-col justify-center dark:hidden bg-gray-100 p-6"
                style={{ backgroundImage: 'url(/assets/GS-bg2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className='flex justify-center items-center min-h-screen'>
                    <div className='rounded-xl shadow-lg bg-white/20 bg-opacity-90 w-[500px] p-8'>
                        <div className='flex flex-col items-center justify-center mb-8'>
                            <h1 className='text-3xl font-bold text-orange-500'>Log In</h1>
                            <p className='text-gray-600 mt-2'>Log in to continue tracking!</p>
                        </div>
                        
                        <div className='mb-6'>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <BsPersonFill className="text-gray-500" />
                                </div>
                                <input
                                    type="username"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className='mb-8'>
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <BsLockFill className="text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            onClick={HandleLogin}
                            disabled={loading}
                            className="w-full bg-orange-500 py-3 text-white rounded-xl hover:bg-orange-600 font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <BiLoaderAlt className="animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <a
                                href='/'
                                className="inline-block border border-orange-500 text-orange-500 py-2 px-6 rounded-lg hover:bg-orange-50 transition-all"
                            >
                                ← Go Back
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dark Theme Login */}
            <div className='hidden dark:block'>
                <section
                    className="h-screen flex flex-col justify-center dark:bg-[#23272f] p-6"
                    style={{ backgroundImage: 'url(/assets/GS-bg3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className='flex justify-center items-center min-h-screen'>
                        <div className='rounded-xl shadow-lg bg-[#1b1b1d]/30 bg-opacity-90 w-[500px] p-8 border border-gray-700'>
                            <div className='flex flex-col items-center justify-center mb-8'>
                                <h1 className='text-3xl font-bold text-white'>Log In</h1>
                                <p className='text-gray-300 mt-2'>Log in to continue tracking!</p>
                            </div>
                            
                            <div className='mb-6'>
                                <label htmlFor="email-d" className="block text-gray-300 font-medium mb-2">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <BsPersonFill className="text-gray-400" />
                                    </div>
                                    <input
                                        type="username"
                                        id="username-d"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-[#1b1b1d]/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='mb-8'>
                                <label htmlFor="password-d" className="block text-gray-300 font-medium mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <BsLockFill className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password-d"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-[#1b1b1d]/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                onClick={HandleLogin}
                                disabled={loading}
                                className="w-full bg-orange-500 py-3 text-white rounded-xl hover:bg-orange-600 font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <BiLoaderAlt className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <span className="flex items-center">
                                    <FiLogIn className="mr-2" /> Log In
                                </span>
                                )}
                            </button>

                            <div className="mt-6 text-center">
                                <a
                                    href='/'
                                    className="inline-block border border-orange-500 text-orange-500 py-2 px-6 rounded-lg hover:bg-orange-500/5 transition-all"
                                >
                                    ← Go Back
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Login;