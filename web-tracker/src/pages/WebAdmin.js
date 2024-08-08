import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WebAdmin() {
    const [packages, setPackages] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [newPackage, setNewPackage] = useState({
        package_id: '',
        description: '',
        weight: 0,
        from_name: '',
        from_address: '',
        to_name: '',
        to_address: ''
    });
    const [newDelivery, setNewDelivery] = useState({
        delivery_id: '',
        package_id: '',
        pickup_time: null,
        start_time: null,
        end_time: null,
        status: 'open',
        location: { lat: 0, lng: 0 }
    });

    const fetchPackages = async () => {
        const res = await axios.get('http://localhost:3000/api/package');
        setPackages(res.data);
    };

    const fetchDeliveries = async () => {
        const res = await axios.get('http://localhost:3000/api/delivery');
        setDeliveries(res.data);
    };

    const createPackage = async () => {
        const res = await axios.post('http://localhost:3000/api/package', newPackage);
        setPackages([...packages, res.data]);
    };

    const createDelivery = async () => {
        const res = await axios.post('http://localhost:3000/api/delivery', newDelivery);
        setDeliveries([...deliveries, res.data]);
    };

    useEffect(() => {
        fetchPackages();
        fetchDeliveries();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <h2>Create New Package</h2>
            <div className="form-group">
                <input type="text" placeholder="Description" value={newPackage.description} onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })} className="input" />
                <input type="number" placeholder="Weight" value={newPackage.weight} onChange={(e) => setNewPackage({ ...newPackage, weight: e.target.value })} className="input" />
                <input type="text" placeholder="From Name" value={newPackage.from_name} onChange={(e) => setNewPackage({ ...newPackage, from_name: e.target.value })} className="input" />
                <input type="text" placeholder="From Address" value={newPackage.from_address} onChange={(e) => setNewPackage({ ...newPackage, from_address: e.target.value })} className="input" />
                <input type="text" placeholder="To Name" value={newPackage.to_name} onChange={(e) => setNewPackage({ ...newPackage, to_name: e.target.value })} className="input" />
                <input type="text" placeholder="To Address" value={newPackage.to_address} onChange={(e) => setNewPackage({ ...newPackage, to_address: e.target.value })} className="input" />
                <button onClick={createPackage} className="btn">Create Package</button>
            </div>

            <h2>Create New Delivery</h2>
            <div className="form-group">
                <input type="text" placeholder="Longitude" 
                onChange={(e) => setNewDelivery({ 
                    ...newDelivery, 
                    location: {...newDelivery.location, lnt: e.target.value} 
                })} 
                className="input" 
                />
                <input type="text" placeholder="Latitude" 
                onChange={(e) => setNewDelivery({ 
                    ...newDelivery, 
                    location: {...newDelivery.location, lat: e.target.value} 
                })} 
                className="input" 
                />
                <select value={newDelivery.package_id} onChange={(e) => setNewDelivery({ ...newDelivery, package_id: e.target.value })} className="input">
                    <option value="">Select Package</option>
                    {packages.map(pkg => (
                        <option key={pkg._id} value={pkg._id}>
                            {pkg._id} - {pkg.description}
                        </option>
                    ))}
                </select>
                <button onClick={createDelivery} className="btn">Create Delivery</button>
            </div>

            <h2>Packages</h2>
            <ul>
                {packages.map((pkg) => (
                    <li key={pkg._id}>
                        <strong>ID:</strong> {pkg._id} <br/>
                        <strong>Description:</strong> {pkg.description}
                    </li>
                ))}
            </ul>

            <h2>Deliveries</h2>
            <ul>
                {deliveries.map((del) => (
                    <li key={del._id}>
                        <strong>ID:</strong> {del._id} <br/>
                        <strong>Status:</strong> {del.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WebAdmin