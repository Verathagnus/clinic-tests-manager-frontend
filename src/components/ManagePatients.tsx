// src/components/ManagePatients.tsx
import { useState, useEffect } from 'react';
import api from '../utils/api';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await api.get('/patients');
      setPatients(response.data);
    };
    fetchPatients();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Manage Patients</h2>
      <ul>
        {patients.map((patient: any) => (
          <li key={patient.id} className="mb-2">
            {patient.name} - {patient.age} - {patient.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePatients;