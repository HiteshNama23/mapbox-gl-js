import React, { useRef, useEffect, useState } from 'react';
import Papa from 'papaparse';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const [text, setText] = useState([]);
  const [ship, setShip] = useState([]);

  // Function to fetch time zone data
  async function fetchTimeZoneData(coordinates) {
    try {
      const response = await fetch(`https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${coordinates[0]},${coordinates[1]}.json?limit=1&layers=contour&access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching time zone data:', error);
    }
  }

  async function GetEnemyData() {
    try {
      const csvData = await fetchShipCsv();
      const data = Papa.parse(csvData, { header: false }); // Treat the first row as data, not headers
      const formattedData = formatDataShip(data.data.slice(1)); // Format data excluding header
      setShip(formattedData);
    } catch (error) {
      console.error('Error fetching or parsing CSV file:', error);
    }
  }

  async function fetchShipCsv(path) {
    const response = await fetch('./enemy_ship.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result.value);
    // console.log("l",csv)
    return csv;
  }

  function formatDataShip(data) {
    return data.map(t => ({
      coordinates: [parseFloat(t[1]), parseFloat(t[2])],
      message: t[0],
      heading: t[3],
      timeStamp: t[4]
    }));
  }

  async function GetData() {
    try {
      const csvData = await fetchCsv();
      const data = Papa.parse(csvData, { header: false }); // Treat the first row as data, not headers
      const formattedData = formatData(data.data.slice(1)); // Format data excluding header
      setText(formattedData);
    } catch (error) {
      console.error('Error fetching or parsing CSV file:', error);
    }
  }

  async function fetchCsv() {
    const response = await fetch('./location_data.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = await decoder.decode(result.value);
    return csv;
  }

  function formatData(data) {
    return data.map(t => ({
      coordinates: [parseFloat(t[2]), parseFloat(t[1])],
      message: t[0]
    }));
  }

  function generateRandomColor() {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256); // Random value between 0 and 255
    const green = Math.floor(Math.random() * 256); // Random value between 0 and 255
    const blue = Math.floor(Math.random() * 256); // Random value between 0 and 255
  
    // Convert RGB values to hexadecimal and concatenate them
    const color = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  
    return color;
  }
  useEffect(() => {
    GetData();
    GetEnemyData(); // Call to fetch ship data
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.9629, 20.5937],
      zoom: 4
    });
    map.addControl(new mapboxgl.NavigationControl());

    text.forEach(location => {
      const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML('<h3>' + location.message + '</h3>'))
        .addTo(map);
    });

    // Draw route for ship data
    let shipRouteData = new Map();
    for (let index = 0; index < ship.length; index++) {
      // console.log(index);
      const currentShip = ship[index];
      if (!shipRouteData.has(currentShip.message)) {
        shipRouteData.set(currentShip.message,[currentShip.coordinates]);
      } else {
        const existingCoordinates = shipRouteData.get(currentShip.message);
        existingCoordinates.push(currentShip.coordinates);
        shipRouteData.set(currentShip.message, existingCoordinates);
      }
    }
    // console.log(shipRouteData);

    for (let key of shipRouteData.keys()) {
      // console.log(shipRoute);
      map.on('load', () => {
        map.addLayer({
          id: key,
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: [],
              geometry: {
                type: 'LineString',
                'coordinates': shipRouteData.get(key)
              }
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': generateRandomColor(), // Random color for each ship
            'line-width': 6
          }
        });
      })
      
    }
    // Function to handle tilequery and bifurcate map into different time zones
    function handleTilequery(event) {
      const coordinates = [event.lngLat.lng, event.lngLat.lat];
      console.log(coordinates);
      fetchTimeZoneData(coordinates).then(response => {
        // Extract time zone data from the response
        const timezone = response.features[0].properties.timezone;
        console.log('Timezone:', timezone);

        // Modify map style based on time zone
        // Example: Change map style based on time zone
        switch (timezone) {
          case 'America/New_York':
            map.setStyle('mapbox://styles/mapbox/dark-v10');
            break;
          case 'America/Los_Angeles':
            map.setStyle('mapbox://styles/mapbox/light-v10');
            break;
          default:
            map.setStyle('mapbox://styles/mapbox/streets-v12');
        }
      }).catch(error => {
        console.error('Error fetching time zone data:', error);
      });
    }

    // Add click event listener to the map to trigger tilequery
    map.on('click', handleTilequery);

    return () => map.remove();
  }, [text, ship]);

  return (
    <div className='cont'>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
