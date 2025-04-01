import React, { useState, useEffect } from 'react';
import Header from './Components/header';
import { BsGlobe2 } from "react-icons/bs";
import ThemeSwitcher from './Components/themeSwitcher';

function HomePage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Scroll event listener
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);

            // Fade-in effect on scroll
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 w-full z-50 flex items-center justify-between p-3 text-white transition-shadow ${isScrolled
                    ? 'border-b border-gray-200 dark:border-gray-800 shadow-md'
                    : ''
                    } `}
            >
                {/* Left Corner: Drawer Toggle Button */}
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

                {/* Right Corner: Buttons */}
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

            {/* Main Content Section */}
            <section
                className="min-h-screen flex flex-col justify-center dark:hidden bg-gray-100 dark:bg-[#23272f] p-6"
                style={{ backgroundImage: 'url(/assets/GS-bg2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Stay in Control with Real - Time Vehicle Tracking Welcome to Trak24!
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">
                        Boost efficiency, reduce costs, and enhance security – Your fleet, tracked effortlessly.
                    </p>
                    <div className="flex justify-center items-center space-x-4">
                        <a
                            href="/login"
                            className="bg-orange-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-orange-500 transition-all"
                        >
                            Start Tracking
                        </a>
                        <a
                            href='https://www.trak24.in'
                            className="border border-orange-600 text-black dark:text-white py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all"
                        >
                            Visit Website ↗
                        </a>
                    </div>
                </div>
            </section>
            <div className='hidden dark:block'>
                <section
                    className="min-h-screen flex flex-col justify-center bg-gray-100 dark:bg-[#23272f] p-6"
                    style={{ backgroundImage: 'url(/assets/GS-bg3.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Stay in Control with Real - Time Vehicle Tracking Welcome to Trak24!
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">
                            Boost efficiency, reduce costs, and enhance security – Your fleet, tracked effortlessly.
                        </p>
                        <div className="flex justify-center items-center space-x-4">
                            <a
                                href="/home"
                                className="bg-orange-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-orange-500 transition-all"
                            >
                                Start Tracking
                            </a>
                            <a
                                href='https://www.trak24.in'
                                className="border border-orange-600 text-black dark:text-white  py-3 px-8 rounded-full shadow-lg dark:hover:text-black hover:bg-gray-100 transition-all"
                            >
                                Visit Website ↗
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            {/* <section
        id="features"
        className='min-h-screen flex flex-col justify-center bg-gray-50 dark:bg-[#1c1f25] p-6 '
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Powerful Features to Optimize Your Fleet
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Real-time tracking, geofencing, detailed reports, and route optimization. Explore how Trak24 can revolutionize your fleet management.
          </p>
          <a
            href="#pricing"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-500 transition-all"
          >
            Explore Features
          </a>
        </div>
      </section>

      <section
        style={{ backgroundImage: 'url(/assets/your-image.jpg)' }}
        className="min-h-screen bg-cover bg-center flex items-center justify-center text-white bg-opacity-50"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Advanced Fleet Management at Your Fingertips</h2>
          <p className="text-lg mb-6">Get real-time insights, detailed analytics, and powerful fleet optimization tools with Trak24.</p>
          <a
            href="#pricing"
            className="bg-blue-600 py-2 px-6 rounded-lg shadow-lg hover:bg-blue-500 transition-all"
          >
            Start Tracking Today
          </a>
        </div>
      </section>

      <section
        id="pricing"
        className="min-h-screen flex flex-col justify-center bg-gray-100 dark:bg-[#23272f] p-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            Affordable Pricing Plans
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Choose the plan that best fits your business needs, with flexible features and scaling options.
          </p>
          <a
            href="#"
            className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-500 transition-all"
          >
            See Pricing Plans
          </a>
        </div>
      </section> */}
        </>
    );
}

export default HomePage;
