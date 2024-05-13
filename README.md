# Ship Tracking Application

## Overview
This application is a React-based ship tracking system that visualizes the locations and routes of ships on a map using Mapbox GL. It fetches ship data from a CSV file and displays it on the map alongside location data obtained from another CSV file. Additionally, users can click on the map to retrieve timezone information for the clicked location, and the map style adjusts based on the timezone.

## Features
- Display ship locations and routes on the map.
- Click on the map to fetch timezone information for the clicked location.
- Adjust the map style based on the timezone of the clicked location.

## Technologies Used
- React: JavaScript library for building user interfaces.
- Mapbox GL: Mapping platform for creating custom maps.
- PapaParse: JavaScript library for parsing CSV data.

## Installation
1. Clone the repository to your local machine:
    ```
    git clone https://github.com/your-username/mapbox-gl-js.git
    ```
2. Navigate to the project directory:
    ```
    cd mapbox=gl-js
    ```
3. Install dependencies using npm or yarn:
    ```
    npm install
    # or
    yarn install
    ```
4. Obtain a Mapbox access token from [Mapbox](https://www.mapbox.com/) and replace `YOUR_MAPBOX_ACCESS_TOKEN` in `App.js` with your token.

## Usage
1. Start the development server:
    ```
    npm start
    # or
    yarn start
    ```
2. Open your browser and navigate to `http://localhost:3000`.
3. Explore the ship tracking application by clicking on the map and observing ship locations and routes.

## Files and Directory Structure
- `App.js`: Main React component containing the application logic.
- `enemyShip.csv`: CSV file containing ship data.
- `location_data.csv`: CSV file containing location data.
- `public/`: Directory containing public assets, including HTML files and CSV data.
- `src/`: Directory containing source code files.
- `README.md`: Documentation file.

## Problems Faced During Development
- **Handling Asynchronous Data Fetching**: One challenge was properly handling asynchronous data fetching using the `fetch` API and ensuring that the application logic executes correctly after the data is fetched.
- **Integrating Mapbox GL with React**: Integrating Mapbox GL with React posed challenges due to differences in handling state and lifecycle methods between React components and Mapbox GL.
- **Styling and Customization**: Adjusting the map style based on timezone information required experimenting with different Mapbox styles and understanding how to dynamically update the map style at runtime.

## Credits
- Map data provided by [Mapbox](https://www.mapbox.com/).
- CSV parsing functionality provided by [PapaParse](https://www.papaparse.com/).

## License
This project is licensed under the [MIT License](LICENSE).
