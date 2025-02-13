import React from "react";

export default function Modal({ open, onClose, children,size }) {
  return (
    // Backdrop
    <div
      onClick={onClose}
      className={`
        fixed inset-0 z-49 flex justify-center items-center transition-all duration-300
        ${open ? "visible bg-black/30" : "invisible bg-transparent"}
      `}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white dark:bg-[#23272f] rounded-2xl shadow-lg  ${size?`${size}`:"w-full max-w-lg"} p-8 relative
          transition-transform duration-300 ease-in-out transform
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full focus:outline-none"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
