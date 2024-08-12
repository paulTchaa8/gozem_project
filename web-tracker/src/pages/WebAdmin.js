import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WebAdmin() {
  const [packages, setPackages] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [newPackage, setNewPackage] = useState({
    package_id: '',
    active_delivery_id: '',
    description: '',
    weight: 0,
    from_name: '',
    from_address: '',
    from_location: { lat: 0, lng: 0 },
    to_name: '',
    to_address: '',
    to_location: { lat: 0, lng: 0 },
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

          <div className="flex-container">
              <div className="form-container">
                  <h2>Add a Package</h2>
                  <div className="form-group">
                      <input
                          type="text"
                          placeholder="Description"
                          value={newPackage.description}
                          onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                          className="input"
                      />
                      <input
                          type="number"
                          placeholder="Weight"
                          value={newPackage.weight}
                          onChange={(e) => setNewPackage({ ...newPackage, weight: e.target.value })}
                          className="input"
                      />
                      <input
                          type="text"
                          placeholder="From Name"
                          value={newPackage.from_name}
                          onChange={(e) => setNewPackage({ ...newPackage, from_name: e.target.value })}
                          className="input"
                      />
                      <input
                          type="text"
                          placeholder="From Address"
                          value={newPackage.from_address}
                          onChange={(e) => setNewPackage({ ...newPackage, from_address: e.target.value })}
                          className="input"
                      />
                      <input
                        type="text"
                        placeholder="From Latitude"
                        onChange={(e) =>
                          setNewPackage({
                            ...newPackage,
                            from_location: { lat: e.target.value, lng: newPackage.from_location.lng },
                          })
                        }
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="From Longitude"
                        onChange={(e) =>
                          setNewPackage({
                            ...newPackage,
                            from_location: { lng: e.target.value, lat: newPackage.from_location.lat },
                          })
                        }
                        className="input"
                      />
                      <input
                          type="text"
                          placeholder="To Name"
                          value={newPackage.to_name}
                          onChange={(e) => setNewPackage({ ...newPackage, to_name: e.target.value })}
                          className="input"
                      />
                      <input
                          type="text"
                          placeholder="To Address"
                          value={newPackage.to_address}
                          onChange={(e) => setNewPackage({ ...newPackage, to_address: e.target.value })}
                          className="input"
                      />
                      <input
                        type="text"
                        placeholder="To Latitude"
                        onChange={(e) =>
                          setNewPackage({
                            ...newPackage,
                            to_location: { lng: newPackage.to_location.lng, lat: e.target.value },
                          })
                        }
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="To Longitude"
                        onChange={(e) =>
                          setNewPackage({
                            ...newPackage,
                            to_location: { lat: newPackage.to_location.lat, lng: e.target.value },
                          })
                        }
                        className="input"
                      />
                      <select
                        value={newPackage.active_delivery_id}
                        onChange={(e) => setNewPackage({ ...newPackage, active_delivery_id: e.target.value })}
                        className="input"
                        >
                        <option value="">Select delivery</option>
                        {deliveries.map((del) => (
                            <option key={del._id} value={del._id}>
                              {del._id} - {del.status}
                            </option>
                        ))}
                      </select>
                      <button onClick={createPackage} className="btn">Add package</button>
                  </div>
              </div>

              <div className="list-container">
                  <h2>Packages</h2>
                  <ul>
                      {packages.map((pkg) => (
                        <li key={pkg._id}>
                            <strong>ID:</strong> {pkg._id} <br/>
                            <strong>Description:</strong> {pkg.description}
                            {pkg.active_delivery_id && <><br/><strong>active delivery:</strong>{pkg.active_delivery_id}</>}
                        </li>
                      ))}
                  </ul>
              </div>
          </div>

          <div className="flex-container">
              <div className="form-container">
                  <h2>Add a Delivery</h2>
                  <div className="form-group">
                      <input
                        type="text"
                        placeholder="Latitude"
                        onChange={(e) =>
                            setNewDelivery({
                                ...newDelivery,
                                location: { ...newDelivery.location, lat: e.target.value },
                            })
                        }
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="Longitude"
                        onChange={(e) =>
                            setNewDelivery({
                                ...newDelivery,
                                location: { ...newDelivery.location, lng: e.target.value },
                            })
                        }
                        className="input"
                      />
                      <select
                          value={newDelivery.package_id}
                          onChange={(e) => setNewDelivery({ ...newDelivery, package_id: e.target.value })}
                          className="input"
                      >
                          <option value="">Select Package</option>
                          {packages.map((pkg) => (
                              <option key={pkg._id} value={pkg._id}>
                                  {pkg._id} - {pkg.description}
                              </option>
                          ))}
                      </select>
                      <button onClick={createDelivery} className="btn">Add Delivery</button>
                  </div>
              </div>

              <div className="list-container">
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
          </div>
      </div>
  );
}

export default WebAdmin;
