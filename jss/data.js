// DATA - EV Bikes and Cities

const E = [
    { n: 'Hero Electric Photon', r: 150, s: 60, p: 112000, b: 3.5 },
    { n: 'Ather 450X', r: 145, s: 80, p: 145000, b: 3.7 },
    { n: 'Ather 450 Plus', r: 160, s: 80, p: 155000, b: 3.9 },
    { n: 'Ather 450 Apex', r: 168, s: 85, p: 165000, b: 4.1 },
    { n: 'Bajaj Chetak', r: 95, s: 60, p: 95000, b: 2.8 },
    { n: 'Bajaj Chetak Premium', r: 110, s: 65, p: 120000, b: 3.2 },
    { n: 'Revolt RV400', r: 150, s: 85, p: 109000, b: 3.24 },
    { n: 'Revolt RV400 Plus', r: 170, s: 85, p: 128000, b: 3.7 },
    { n: 'Hero Electric iON', r: 65, s: 45, p: 65000, b: 1.8 },
    { n: 'Hero Electric Nyx', r: 110, s: 55, p: 88000, b: 2.5 },
    { n: 'TVS iQube', r: 95, s: 45, p: 85000, b: 2.6 },
    { n: 'TVS iQube ST', r: 110, s: 60, p: 105000, b: 3.0 },
    { n: 'Okinawa Dual', r: 85, s: 60, p: 72000, b: 2.0 },
    { n: 'Okinawa Praise', r: 120, s: 65, p: 98000, b: 2.5 },
    { n: 'Komaki DX2000', r: 130, s: 70, p: 110000, b: 3.2 },
    { n: 'Simple Energy One', r: 240, s: 100, p: 299000, b: 8.5 },
    { n: 'Tork Kratos', r: 100, s: 60, p: 68000, b: 2.2 },
    { n: 'Anyah EV', r: 70, s: 50, p: 62000, b: 1.6 },
    { n: 'Jitendra Electric Gearless', r: 80, s: 45, p: 55000, b: 1.5 },
    { n: 'Kinetic Green Volta Plus', r: 90, s: 55, p: 78000, b: 2.1 }
];

const C = [
    { n: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { n: 'Mumbai', lat: 19.076, lon: 72.8777 },
    { n: 'Delhi', lat: 28.7041, lon: 77.1025 },
    { n: 'Hyderabad', lat: 17.385, lon: 78.4867 },
    { n: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { n: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    { n: 'Pune', lat: 18.5204, lon: 73.8567 },
    { n: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    { n: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
    { n: 'Lucknow', lat: 26.8467, lon: 80.9462 },
    { n: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
    { n: 'Indore', lat: 22.7196, lon: 75.8577 },
    { n: 'Bhopal', lat: 23.1815, lon: 79.9864 },
    { n: 'Surat', lat: 21.1458, lon: 72.8336 },
    { n: 'Vadodara', lat: 22.3072, lon: 73.1812 },
    { n: 'Coimbatore', lat: 11.0081, lon: 76.8994 },
    { n: 'Kochi', lat: 9.9312, lon: 76.2673 },
    { n: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366 }
];

const ST = [
    { n: 'Bangalore Hub', lat: 12.972, lon: 77.595 },
    { n: 'Mumbai Central', lat: 19.076, lon: 72.878 },
    { n: 'Delhi Station', lat: 28.704, lon: 77.103 },
    { n: 'Hyderabad Fast Charge', lat: 17.386, lon: 78.487 },
    { n: 'Chennai South', lat: 13.083, lon: 80.271 },
    { n: 'Pune East', lat: 18.520, lon: 73.857 },
    { n: 'Jaipur North', lat: 26.913, lon: 75.788 },
    { n: 'Ahmedabad West', lat: 23.023, lon: 72.571 }
];
// Add more major Indian cities
C.push(
    { n: 'Mysore', lat: 12.2958, lon: 76.6394 },
    { n: 'Mangalore', lat: 12.9141, lon: 74.8560 },
    { n: 'Hubli', lat: 15.3647, lon: 75.1240 },
    { n: 'Belgaum', lat: 15.8497, lon: 74.4977 },
    { n: 'Udupi', lat: 13.3409, lon: 74.7421 },
    { n: 'Shimoga', lat: 13.9299, lon: 75.5681 },
    { n: 'Davangere', lat: 14.4644, lon: 75.9218 },
    { n: 'Tumkur', lat: 13.3379, lon: 77.1173 },
    { n: 'Hassan', lat: 13.0033, lon: 76.1004 },
    { n: 'Chitradurga', lat: 14.2306, lon: 76.3980 },

    { n: 'Nagpur', lat: 21.1458, lon: 79.0882 },
    { n: 'Visakhapatnam', lat: 17.6868, lon: 83.2185 },
    { n: 'Patna', lat: 25.5941, lon: 85.1376 },
    { n: 'Bhubaneswar', lat: 20.2961, lon: 85.8245 },
    { n: 'Guwahati', lat: 26.1445, lon: 91.7362 },
    { n: 'Ranchi', lat: 23.3441, lon: 85.3096 },
    { n: 'Raipur', lat: 21.2514, lon: 81.6296 },
    { n: 'Dehradun', lat: 30.3165, lon: 78.0322 },
    { n: 'Goa (Panaji)', lat: 15.4909, lon: 73.8278 }
);

const WMO = {
    0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle',
    53: 'Moderate drizzle', 55: 'Dense drizzle', 61: 'Slight rain',
    63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow',
    73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers',
    82: 'Violent rain showers', 85: 'Slight snow showers',
    86: 'Heavy snow showers', 95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
};
ST.push(
    { n: 'Mysore Charging Hub', lat: 12.2958, lon: 76.6394 },
    { n: 'Mangalore Port Station', lat: 12.9141, lon: 74.8560 },
    { n: 'Hubli EV Point', lat: 15.3647, lon: 75.1240 },
    { n: 'Belgaum Green Charge', lat: 15.8497, lon: 74.4977 },
    { n: 'Udupi Highway Station', lat: 13.3409, lon: 74.7421 },
    { n: 'Shimoga Fast Charge', lat: 13.9299, lon: 75.5681 },
    { n: 'Davangere EV Station', lat: 14.4644, lon: 75.9218 },
    { n: 'Tumkur Express Charge', lat: 13.3379, lon: 77.1173 },
    { n: 'Hassan Green Energy Hub', lat: 13.0033, lon: 76.1004 },
    { n: 'Chitradurga Highway EV Stop', lat: 14.2306, lon: 76.3980 }
);