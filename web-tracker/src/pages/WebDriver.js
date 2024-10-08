import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)
const apiUrl = process.env.REACT_APP_API_URL

function WebDriver() {
    const [deliveryId, setDeliveryId] = useState('');
    const [deliveryData, setDeliveryData] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);

    const fetchDeliveryData = async () => {
        const res = await axios.get(`${apiUrl}/delivery/${deliveryId}`);
        setDeliveryData(res.data);
        setDriverLocation(res.data.location);
    };

    const updateStatus = (status) => {
        axios.put(`${apiUrl}/delivery/${deliveryId}/status`, { status })
            .then(response => {
                // Mettre à jour les données de livraison locales
                setDeliveryData(response.data);
                fetchDeliveryData()
                // Informer le serveur via WebSocket
                socket.emit('status_changed', { delivery_id: deliveryId, status });
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour du statut:", error);
            });
    };
  
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

    useEffect(() => {
        if (deliveryData) {
            const interval = setInterval(() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setDriverLocation(location);
                    socket.emit('location_changed', { delivery_id: deliveryId, location });
                });
            }, 20000);

            return () => clearInterval(interval);
        }
    }, [deliveryData]);

    return (
        <div>
            <h1>Driver Dashboard</h1>
            <div className="input-group">
            <input
                type="text"
                value={deliveryId}
                onChange={(e) => setDeliveryId(e.target.value)}
                placeholder="Enter Delivery ID"
                className="input"
            />
            <button onClick={fetchDeliveryData} className="btn">Load Delivery</button>
            </div>

            {deliveryData && (
                <div className="delivery-details">
                    <h2>Delivery Details</h2>
                    <p><strong>ID:</strong> {deliveryData._id}</p>
                    <p><strong>Status:</strong> {deliveryData.status}</p>
                    <div className="status-map-container">
                      {driverLocation && (
                        <MapContainer center={[driverLocation.lat, driverLocation.lng]} zoom={13} className="leaflet-container">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker 
                              position={[driverLocation.lat, driverLocation.lng]}
                              icon={customMarkerIcon}
                              >
                                <Popup>
                                  <div>
                                    <p>Vous etes ici</p>
                                    <p><strong>Lat: </strong> {driverLocation.lat}</p>
                                    <p><strong>Lng: </strong> {driverLocation.lng}</p>
                                  </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                      )}
                        <div className="status-buttons">
                        {/* mise a jour du statut updateStatus() */}
                        <button onClick={() => updateStatus('picked-up')}  disabled={deliveryData.status !== 'open'} className="btn btn-primary">Picked Up</button>
                        <button onClick={() => updateStatus('in-transit')} style={{ background: '#f5990b' }} disabled={deliveryData.status !== 'picked-up'} className="btn">In Transit</button>
                        <button onClick={() => updateStatus('delivered')} style={{ background: '#437a45' }} disabled={deliveryData.status !== 'in-transit'} className="btn">Delivered</button>
                        <button onClick={() => updateStatus('failed')} style={{ background: '#d11' }} disabled={deliveryData.status !== 'in-transit'} className="btn">Failed</button>
                      </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WebDriver;
