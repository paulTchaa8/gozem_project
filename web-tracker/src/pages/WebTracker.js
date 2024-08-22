import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)
const apiUrl = process.env.REACT_APP_API_URL

function WebTracker() {
    const [packageId, setPackageId] = useState('')
    const [packageData, setPackageData] = useState(null)
    const [deliveryData, setDeliveryData] = useState(null)
    const [currentLocation, setCurrentLocation] = useState(null)
  
    // Charger des images personnalisées pour les icônes
    const customMarkerIcon = new L.Icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconSize: [25, 41], // taille de l'icône
      iconAnchor: [12, 41], // ancre de l'icône (le point qui correspond à la latitude/longitude)
      popupAnchor: [1, -34], // point où s'ouvre le popup par rapport à l'ancre de l'icône
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      shadowSize: [41, 41]
    })

    // Fetch le package a partir du package ID
    const fetchPackageData = async () => {
        try {
            const res = await axios.get(`${apiUrl}/package/${packageId}`);
            setPackageData(res.data);

            if (res.data.active_delivery_id) {
                console.log('active oui', res.data.active_delivery_id)
                fetchDeliveryData(res.data.active_delivery_id);
            }
        } catch (error) {
            console.error("Error fetching package data:", error);
        }
    };

    // recuperer la livraison active..
    const fetchDeliveryData = async (deliveryId) => {
        try {
            const res = await axios.get(`${apiUrl}/delivery/${deliveryId}`);
            setDeliveryData(res.data)
            setCurrentLocation(res.data.location) // position initiale.

            // mise a jour des delivery via websockets
            socket.on('delivery_updated', (data) => {
                if (data._id === deliveryId) {
                    setDeliveryData(data)
                    setCurrentLocation(data.location) // mettre a jour la map ici..
                }
            });
        } catch (error) {
            console.error("Erreur fetching delivery data:", error)
        }
    }

    useEffect(() => {
        return () => {
            socket.off('delivery_updated');
        }
    }, [])

    useEffect(() => {
        fetchPackageData()
    }, [packageId])
    
    return (
        <div>
            <h1>Track Your Package</h1>
            <div className="input-group">
                <input
                    type="text"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    placeholder="Enter Package ID"
                    className="input"
                />
                {/* <button onClick={fetchPackageData} className="btn">Track</button> */}
            </div>

            {packageData && (
                <div className="package-details">
                    <h2>Package Details</h2>
                    <p><strong>Description:</strong> {packageData.description}</p>
                    <p><strong>Weight:</strong> {packageData.weight} grams</p>
                </div>
            )}

            {deliveryData && currentLocation && (
                <div className="delivery-details">
                  <h2>Delivery Details</h2>
                  <p><strong>Status:</strong> {deliveryData.status}</p>
                  <p><strong>Current Location:</strong> {currentLocation.lat}, {currentLocation.lng}</p>

                  <MapContainer key={packageData._id} 
                    center={[currentLocation.lat, currentLocation.lng]} zoom={13} 
                    className="leaflet-container"
                  >
                      <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[
                        packageData.from_location.lat, 
                        packageData.from_location.lng
                        ]}
                        icon={customMarkerIcon}
                      >
                        <Popup>
                          <div>
                            <p><strong>Source:</strong> {packageData.from_address}</p>
                            <p><strong>Lat: </strong> {packageData.from_location.lat}</p>
                            <p><strong>Lng: </strong> {packageData.from_location.lng}</p>
                          </div>
                        </Popup>
                      </Marker>

                      <Marker position={[
                        currentLocation.lat, 
                        currentLocation.lng
                        ]}
                        icon={customMarkerIcon}
                      >
                        <Popup>
                          <div>
                            <p>Position actuelle</p>
                            <p><strong>Lat: </strong> {currentLocation.lat}</p>
                            <p><strong>Lng: </strong> {currentLocation.lng}</p>
                          </div>  
                        </Popup>
                      </Marker>

                      <Marker position={[
                        packageData.to_location.lat, 
                        packageData.to_location.lng
                        ]}
                        icon={customMarkerIcon}
                      >
                        <Popup>
                          <div>
                            <p><strong>Destination:</strong> {packageData.to_address}</p>
                            <p><strong>Lat: </strong>{packageData.to_location.lat}</p>
                            <p><strong>Lng: </strong>{packageData.to_location.lng}</p>
                          </div>
                        </Popup>
                      </Marker>

                      <Polyline positions={[
                          [packageData.from_location.lat, packageData.from_location.lng],
                          [currentLocation.lat, currentLocation.lng],
                          [packageData.to_location.lat, packageData.to_location.lng]
                        ]} color="blue" />
                  </MapContainer>
                </div>
            )}
        </div>
    );
}

export default WebTracker;
