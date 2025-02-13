import React, { createContext, useEffect, useState, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Theme Provider Component
export const AuthProvider = ({ children }) => {
    const secretKey = "#TRAK24,#TRAK,CLT";

    // Simple encryption function
    const encryptData = (data) => {
        const stringifiedData = JSON.stringify(data); // Convert the object to a string
        const encodedData = btoa(stringifiedData + secretKey); // Base64 encode
        localStorage.setItem('#46DET27', encodedData); // Save to localStorage
    }
    
    // Simple decryption function
    const decryptData = () => {
        const encryptedData = localStorage.getItem('#46DET27');
        const decodedData = atob(encryptedData); // Base64 decode
        const originalData = decodedData.replace(secretKey, ''); // Remove the secret key
        return JSON.parse(originalData); // Convert back to an object
    }

    return (
        <AuthContext.Provider value={{ encryptData, decryptData }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
