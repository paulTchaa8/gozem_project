import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const socket = io('http://localhost:3000');

function WebTracker() {
    const [packageId, setPackageId] = useState('');
    const [packageData, setPackageData] = useState(null);
    const [deliveryData, setDeliveryData] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

    // Fetch le package a partir du package ID
    const fetchPackageData = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/package/${packageId}`);
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
            const res = await axios.get(`http://localhost:3000/api/delivery/${deliveryId}`);
            setDeliveryData(res.data)
            setCurrentLocation(res.data.location) // position initiale.

            // Listen for delivery updates via WebSocket
            socket.on('delivery_updated', (data) => {
                if (data.delivery_id === deliveryId) {
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
    
    console.log('current ifif', currentLocation)
    console.log('pack log', packageData, deliveryData)
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

                    <MapContainer center={[currentLocation.lat, currentLocation.lng]} zoom={13} className="leaflet-container">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[packageData.from_location.lat, packageData.from_location.lng]}>
                            <Popup>Package Source</Popup>
                        </Marker>
                        <Marker position={[packageData.to_location.lat, packageData.to_location.lng]}>
                            <Popup>Package Destination</Popup>
                        </Marker>
                        <Marker position={[currentLocation.lat, currentLocation.lng]}>
                            <Popup>Current Location</Popup>
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
