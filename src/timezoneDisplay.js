import React, { useState, useEffect } from 'react';

function TimezoneDisplay({ timezone, coordinates }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
        const data = await response.json();
        setCurrentTime(data.datetime);
      } catch (error) {
        console.error('Error fetching current time:', error);
      }
    };

    fetchTime();

    // Update time every minute
    const interval = setInterval(() => {
      fetchTime();
    }, 60000);

    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div style={{ position: 'absolute', top: coordinates[1], left: coordinates[0], backgroundColor: 'white', padding: '5px' }}>
      <p>{timezone}</p>
      <p>{currentTime}</p>
    </div>
  );
}

export default TimezoneDisplay;
