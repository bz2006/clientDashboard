import React from "react";
import axios from "axios";
import polyline from "@mapbox/polyline"
import { TbLocation, TbMessage, TbReportAnalytics } from "react-icons/tb"; // Import the required icons
import { FaRegMap, FaGlobeAmericas } from "react-icons/fa";
import { PiTruck, PiInfoLight } from "react-icons/pi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { MdSupportAgent } from "react-icons/md";
import Header from "../Components/header";


const Card = ({ icon: Icon, name, path }) => (
  <a href={path} className="cursor-pointer flex flex-col items-center justify-center border border-gray-300 rounded-lg p-2 transition-all duration-400 ease-in-out 
    hover:shadow-sm hover:shadow-gray-400 
    dark:hover:shadow-sm dark:hover:shadow-orange-500 
    w-80 h-36"> {/* Increased width and adjusted padding */}
    <div className="text-4xl mb-2"><Icon /></div> {/* Render the icon component */}
    <div className="text-lg font-medium">{name}</div>
  </a>
);

const Home = () => {
  const cards = [
    { icon: TbLocation, name: "Core Tracking", path: "/core-tracking" },
    { icon: FaRegMap, name: "Map Tracking", path: "/map-tracking" },
    { icon: TbMessage, name: "Messages", path: "/messages" },
    { icon: FaGlobeAmericas, name: "Point of Intrest", path: "/point-of-intrest" },
    { icon: TbReportAnalytics, name: "Reports", path: "/reports" },
    // { icon: PiTruck, name: "Fleet Management", path: "/fleet-management" },
    // { icon: HiOutlineWrenchScrewdriver, name: "Maintanace Management", path: "/maintanace-management" },
    { icon: MdSupportAgent, name: "Support Center",path: "/support-center"  },
    { icon: PiInfoLight, name: "Asset Info", path: "/assets-info" },
  ];

  return (
    <>
      <Header />

      <div className="flex items-center py-32 justify-center min-h-screen p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {cards.map((card, index) => (
            <Card key={index} icon={card.icon} name={card.name} path={card.path} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
