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

    // Fetch package data based on package ID
    const fetchPackageData = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/package/${packageId}`);
            setPackageData(res.data);

            if (res.data.active_delivery_id) {
                fetchDeliveryData(res.data.active_delivery_id);
            }
        } catch (error) {
            console.error("Error fetching package data:", error);
        }
    };

    // Fetch delivery data if the package has an active delivery
    const fetchDeliveryData = async (deliveryId) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/delivery/${deliveryId}`);
            setDeliveryData(res.data);
            setCurrentLocation(res.data.location); // Set initial location

            // Listen for delivery updates via WebSocket
            socket.on('delivery_updated', (data) => {
                if (data.delivery_id === deliveryId) {
                    setDeliveryData(data);
                    setCurrentLocation(data.location); // Update current location on the map
                }
            });
        } catch (error) {
            console.error("Error fetching delivery data:", error);
        }
    };

    // Clean up socket connection when the component unmounts
    useEffect(() => {
        return () => {
            socket.off('delivery_updated');
        };
    }, []);

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
                <button onClick={fetchPackageData} className="btn">Track</button>
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
                        <Marker position={[deliveryData.source.lat, deliveryData.source.lng]}>
                            <Popup>Package Source</Popup>
                        </Marker>
                        <Marker position={[deliveryData.destination.lat, deliveryData.destination.lng]}>
                            <Popup>Package Destination</Popup>
                        </Marker>
                        <Marker position={[currentLocation.lat, currentLocation.lng]}>
                            <Popup>Current Location</Popup>
                        </Marker>
                        <Polyline positions={[
                            [deliveryData.source.lat, deliveryData.source.lng],
                            [currentLocation.lat, currentLocation.lng],
                            [deliveryData.destination.lat, deliveryData.destination.lng]
                        ]} color="blue" />
                    </MapContainer>
                </div>
            )}
        </div>
    );
}

export default WebTracker;
