import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token'); // Get the token from localStorage

  if (!token) {
    return false; // No token = not authenticated
  }

  try {
    const decoded = jwtDecode(token);    
    const currentTime = Date.now() / 1000;   // Convert time to seconds
    const check= decoded.exp > currentTime;  
    if(!check){
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return check
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};
