import React, { useState } from 'react';
import Header from '../Components/header';

import { TbFileInvoice } from "react-icons/tb";
import { TbDeviceIpadHorizontalExclamation } from "react-icons/tb";
import { TbMapExclamation } from "react-icons/tb";
import { TbDatabaseExclamation } from "react-icons/tb";
import { BsBookmarkCheck } from "react-icons/bs";
import CreateNewCase from './Modals/CreateCase';

const Card = ({ icon: Icon, name, onclick }) => (
  <a onClick={onclick} className="cursor-pointer flex flex-col items-center justify-center border border-gray-300 rounded-lg p-2 transition-all duration-400 ease-in-out 
    hover:shadow-sm hover:shadow-gray-400 
    dark:hover:shadow-sm dark:hover:shadow-orange-500 
    w-80 h-36"> {/* Increased width and adjusted padding */}
    <div className="text-4xl mb-2"><Icon /></div> {/* Render the icon component */}
    <div className="text-lg font-medium">{name}</div>
  </a>
);
const SupportCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState("");
  const closeModal = () => setIsModalOpen(false);
  const [selectedCase, setSelectedCase] = useState("");
  const handleCardClick = (caseType) => {
    setSelectedCase(caseType);
    setIsModalOpen(true);
  };
  const cards = [
    { icon: TbFileInvoice, name: "Billing & Subsciptions", case: "Accounts" }, // Pass icon component here
    { icon: TbDeviceIpadHorizontalExclamation, name: "Device Issues", case: "Device"},
    { icon: TbMapExclamation, name: "GIS Errors", case: "GIS"},
    { icon: TbDatabaseExclamation, name: "IT Errors", case: "IT" },
    // { icon: BsBookmarkCheck, name: "Support request Status", case: "Support"},
  ];

  return (
    <>
      <Header />

      <div className='w-full flex items-start justify-center mt-24'>
        <h1 className='text-4xl font-bold'>Support Center</h1>
      </div>

      <div className="flex items-center justify-center p-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 cols items-center justify-items-center">
          {cards.map((card, index) => (
            <Card key={index} onclick={() => handleCardClick(card.case)} icon={card.icon} name={card.name} path={card.path} />

          ))}
          {isModalOpen ? (
            <CreateNewCase open={isModalOpen} selected={selectedCase} onClose={closeModal} />
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-center mt-10 mb-10">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-5xl">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <span className="font-medium text-gray-600 dark:text-gray-400">Monitoring Package:</span>
            <span className="text-gray-900 dark:text-gray-100">Eagle Eye Monitoring Software</span>

            <span className="font-medium text-gray-600 dark:text-gray-400">Call Center:</span>
            <span className="text-gray-900 dark:text-gray-100">Monitoring Center Cochin Operations</span>

            <span className="font-medium text-gray-600 dark:text-gray-400">Address:</span>
            <span className="text-gray-900 dark:text-gray-100">
              Silver Lane, Ashoka Rd, Kaloor, Ernakulam - 682017, Kerala
            </span>

            <span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span>
            <span className="text-gray-900 dark:text-gray-100">+91-484-400-0182</span>

            <span className="font-medium text-gray-600 dark:text-gray-400">Support Email:</span>
            <span className="text-gray-900 dark:text-gray-100">support@trak24.com</span>

            <span className="font-medium text-gray-600 dark:text-gray-400">Accounts Email:</span>
            <span className="text-gray-900 dark:text-gray-100">accounts@trak24.com</span>
          </div>
        </div>
      </div>

    </>
  )
};
export default SupportCenter