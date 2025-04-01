import React, { useState } from 'react';
import Header from '../Components/header';
import { TbFileInvoice, TbDeviceIpadHorizontalExclamation, TbMapExclamation, TbDatabaseExclamation } from "react-icons/tb";
import CreateNewCase from './Modals/CreateCase';

const Card = ({ icon: Icon, name, onclick }) => (
  <div 
    onClick={onclick} 
    className="cursor-pointer flex flex-col items-center justify-center p-6 
      bg-white/80 backdrop-blur-sm dark:bg-[#1b1b1d] rounded-2xl
      shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-102
      border border-gray-100 dark:border-gray-800
      hover:border-orange-500 dark:hover:border-orange-500
      w-full aspect-square"
  >
    <div className="text-5xl mb-4 text-orange-600 dark:text-orange-400">
      <Icon />
    </div>
    <div className="text-lg font-medium text-center text-gray-800 dark:text-gray-200">
      {name}
    </div>
  </div>
);

const SupportCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const [selectedCase, setSelectedCase] = useState("");
  
  const handleCardClick = (caseType) => {
    setSelectedCase(caseType);
    setIsModalOpen(true);
  };
  
  const cards = [
    { icon: TbFileInvoice, name: "Billing & Subscriptions", case: "Accounts" },
    { icon: TbDeviceIpadHorizontalExclamation, name: "Device Issues", case: "Device" },
    { icon: TbMapExclamation, name: "GIS Errors", case: "GIS" },
    { icon: TbDatabaseExclamation, name: "IT Errors", case: "IT" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#1b1b1d]">
      <Header />

      <div className="container mt-10 mx-auto px-4 py-12">
        <div className="text-center pt-8 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-lg">
            Choose a category below to get the assistance you need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <Card 
              key={index} 
              onclick={() => handleCardClick(card.case)} 
              icon={card.icon} 
              name={card.name} 
            />
          ))}
        </div>

        <div className="mt-20 mb-16">
          <div className="bg-white/90 backdrop-blur-sm dark:bg-[#1b1b1d] shadow-xl rounded-3xl overflow-hidden max-w-4xl mx-auto border border-gray-100 dark:border-gray-800">
            <div className="px-8 py-5 bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-600 dark:to-orange-900">
              <h2 className="text-xl font-semibold text-white">Contact Information</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monitoring Package</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">Eagle Eye Monitoring Software</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Call Center</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">Monitoring Center Cochin Operations</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    Silver Lane, Ashoka Rd, Kaloor, Ernakulam - 682017, Kerala
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">+91-484-400-0182</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Support Email</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">support@trak24.com</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Accounts Email</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">accounts@trak24.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreateNewCase open={isModalOpen} selected={selectedCase} onClose={closeModal} />
      )}
    </div>
  );
};

export default SupportCenter;