import React from "react";
import axios from "axios";
import polyline from "@mapbox/polyline";
import { TbLocation, TbMessage, TbReportAnalytics } from "react-icons/tb";
import { FaRegMap, FaGlobeAmericas } from "react-icons/fa";
import { PiTruck, PiInfoLight } from "react-icons/pi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { MdSupportAgent } from "react-icons/md";
import Header from "../Components/header";

const Card = ({ icon: Icon, name, path }) => (
  <a 
    href={path} 
    className="group flex items-center gap-6 bg-gray-100 dark:bg-[#1b1b1d] rounded-xl p-6 w-full transition-all duration-300
    shadow-[8px_8px_16px_0px_#d1d9e6,_-8px_-8px_16px_0px_#ffffff] 
    dark:shadow-[8px_8px_16px_0px_#151517,_-8px_-8px_16px_0px_#222224]
    hover:shadow-[inset_6px_6px_12px_0px_#d1d9e6,_inset_-6px_-6px_12px_0px_#ffffff]
    dark:hover:shadow-[inset_6px_6px_12px_0px_#151517,_inset_-6px_-6px_12px_0px_#222224]"
  >
    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-[#1b1b1d] text-orange-600 dark:text-orange-400
    shadow-[4px_4px_8px_0px_#d1d9e6,_-4px_-4px_8px_0px_#ffffff] 
    dark:shadow-[4px_4px_8px_0px_#151517,_-4px_-4px_8px_0px_#222224]
    group-hover:shadow-[inset_3px_3px_6px_0px_#d1d9e6,_inset_-3px_-3px_6px_0px_#ffffff]
    dark:group-hover:shadow-[inset_3px_3px_6px_0px_#151517,_inset_-3px_-3px_6px_0px_#222224]">
      <Icon className="text-2xl" />
    </div>
    <div>
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to access</p>
    </div>
  </a>
);

const Home = () => {
  const cards = [
    { icon: TbLocation, name: "Core Tracking", path: "/core-tracking" },
    { icon: FaRegMap, name: "Map Tracking", path: "/map-tracking" },
    { icon: TbMessage, name: "Messages", path: "/messages" },
    { icon: FaGlobeAmericas, name: "Point of Interest", path: "/point-of-intrest" },
    { icon: TbReportAnalytics, name: "Reports", path: "/reports" },
    { icon: MdSupportAgent, name: "Support Center", path: "/support-center" },
    { icon: PiInfoLight, name: "Asset Info", path: "/assets-info" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#1b1b1d]">
      <Header />
      
      <main className="flex-1 mt-16 px-8 py-6 mx-auto w-full">
        <div className="mb-8 px-4 py-6 rounded-xl ">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Access all your tracking and fleet management tools</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <Card key={index} icon={card.icon} name={card.name} path={card.path} />
          ))}
        </div>
        
        {/* <div className="mt-12 bg-gray-100 dark:bg-[#1b1b1d] rounded-xl p-6
          shadow-[8px_8px_16px_0px_#d1d9e6,_-8px_-8px_16px_0px_#ffffff]
          dark:shadow-[8px_8px_16px_0px_#151517,_-8px_-8px_16px_0px_#222224]">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1b1b1d] text-blue-600 dark:text-orange-400
              shadow-[4px_4px_8px_0px_#d1d9e6,_-4px_-4px_8px_0px_#ffffff]
              dark:shadow-[4px_4px_8px_0px_#151517,_-4px_-4px_8px_0px_#222224]">
              <TbReportAnalytics className="text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
          </div>
          <div className="p-6 rounded-xl text-center
            shadow-[inset_6px_6px_12px_0px_#d1d9e6,_inset_-6px_-6px_12px_0px_#ffffff]
            dark:shadow-[inset_6px_6px_12px_0px_#151517,_inset_-6px_-6px_12px_0px_#222224]">
            <p className="text-gray-500 dark:text-gray-300">No recent activities to display</p>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default Home;