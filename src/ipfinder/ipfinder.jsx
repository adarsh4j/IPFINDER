// import { useState, useEffect } from 'react'
// import axios, { Axios } from 'axios' 
// import style from './ipfinder.module.css'

//  function ipfinder() {
//  const[ipdetails, setipdetails]=useState([])
//  const[lat,setlat]=useState('');
//  const[lon,setlon]=useState('');
 
//  useEffect(()=>{
//   Axios.get()
//  })
//   return (
//    <div>
//     <div className={style.container}>
     
//     </div>
//     </div>
//   )
// }
// export default ipfinder

import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import style from './ipfinder.module.css';

// Customizing Leaflet's default icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41] // size of the shadow
});

const ipfinder = () => {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch IP data from the API
    const fetchIPData = async () => {
      try {
        const response = await axios.get('https://ipinfo.io/json?YOUR_ACCESS CODE');
        setIpData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch IP data');
        setLoading(false);
      }
    };
    fetchIPData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Extract latitude and longitude from ipData.loc
  const [latitude, longitude] = ipData?.loc?.split(',') || [0, 0];

  return (
    <div className={style.container}>
      <h1>IP Finder</h1>
      {ipData && (
        <>
          <div className={style.card}>
            <p><strong>IP Address:</strong> {ipData.ip}</p>
            <p><strong>City:</strong> {ipData.city}</p>
            <p><strong>Region:</strong> {ipData.region}</p>
            <p><strong>Country:</strong> {ipData.country}</p>
            <p><strong>ISP:</strong> {ipData.org}</p>
          </div>

          {/* Display map centered on user's location */}
          <MapContainer 
            center={[latitude, longitude]} 
            zoom={13} 
            style={{ height: "400px", width: "400px", marginTop: "100px", marginLeft:"1110px", borderRadius:"10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]} icon={customIcon}>
              <Popup>
                {ipData.city}, {ipData.region}, {ipData.country}
              </Popup>
            </Marker>
          </MapContainer>
        </>
      )}
    </div>
  );
};

export default ipfinder;
