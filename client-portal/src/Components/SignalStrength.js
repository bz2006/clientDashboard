import React from 'react';

const SignalStrengthIcon = ({ strength }) => {
  const bars = [0, 1, 2, 3, 4]; // Array to represent the bars

  // Determine the color of each bar
  const getBarColor = (bar) => {
    if (strength === 0) return 'bg-gray-300'; // All gray for strength 0

    if (strength >= 1 && strength <= 10) {
      return bar === 0 ? 'bg-red-500' : 'bg-gray-300'; // First bar green
    }

    if (strength >= 11 && strength <= 20) {
      return bar <= 1 ? 'bg-red-500' : 'bg-gray-300'; // First 2 bars green
    }

    if (strength >= 21 && strength <= 50) {
      return bar <= 2 ? 'bg-green-500' : 'bg-gray-300'; // First 3 bars green
    }

    if (strength >= 51 && strength <= 89) {
      return bar <= 3 ? 'bg-green-500' : 'bg-gray-300'; // First 4 bars green
    }

    if (strength >= 90 && strength <= 100) {
      return 'bg-green-500'; // All bars green
    }

    return 'bg-gray-300'; // Default fallback
  };

  return (
    <div className="relative flex items-end space-x-0.5">
      {/* Render the signal bars */}
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-1.5 rounded ${getBarColor(bar)}`}
          style={{
            height: `${(bar + 1) * 6}px`, // Reduced height for compact size
          }}
        ></div>
      ))}

      {/* Display the "X" if signal strength is 0 */}
      {strength === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500 font-extrabold text-lg">X</span>
        </div>
      )}
    </div>
  );
};

export default SignalStrengthIcon;
