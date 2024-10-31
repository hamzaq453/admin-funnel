'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Lead {
  id: number;
  jobImportance: string;
  customerExperience: string;
  contactTime: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

interface LeadDetailPageProps {
  id: string;
}

const LeadDetailPage: React.FC<LeadDetailPageProps> = ({ id }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Neu'); // Default to 'Neu' initially
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/leads/${id}`);
        if (!response.ok) throw new Error('Fehler beim Abrufen des Leads');

        const data = await response.json();
        setLead(data.lead);
        
        // Set status to 'Neu' if it is not set or missing
        setStatus(data.lead.status || 'Neu'); 
      } catch (error) {
        console.error('Fehler beim Abrufen des Leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setIsStatusChanged(true);
  };

  const saveStatusChange = async () => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setIsStatusChanged(false); // Reset the save button visibility
      } else {
        throw new Error('Fehler beim Aktualisieren des Status');
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
    }
  };

  const deleteLead = async () => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.back(); // Navigate back to the leads list after deletion
      } else {
        throw new Error('Fehler beim Löschen des Leads');
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Leads:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!lead) return <p>Lead nicht gefunden</p>;

  return (
    <div className="max-w-full ml-2 bg-white p-2 rounded-lg shadow-md mt-10">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Lead-Details</h1>
        <Button
          variant="outline"
          onClick={deleteLead}
          className="bg-red-100 text-red-600 border border-red-600 hover:bg-red-200"
        >
          Löschen
        </Button>
      </header>

      {/* Status Buttons */}
      <div className="flex space-x-4 mb-6">
        {['Neu', 'Ausstehend', 'In Bearbeitung', 'Genehmigt', 'Abgelehnt'].map((option) => (
          <button
            key={option}
            onClick={() => handleStatusChange(option)}
            className={`px-4 py-2 rounded-full w-full font-semibold ${
              status === option
                ? 'bg-blue-500 text-white' // Blue for current status
                : 'bg-gray-200 text-gray-500' // Gray for other statuses
            }`}
          >
            {option}
          </button>
        ))}
        {isStatusChanged && (
          <Button
            onClick={saveStatusChange}
            className="ml-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            Speichern
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 border-t">
        <div>
          <label className="text-gray-500 text-sm">Name</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.fullName}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Job-Wichtigkeit</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.jobImportance}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Kundenerfahrung</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.customerExperience}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Kontaktzeit</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.contactTime}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">E-Mail</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.email}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Telefon</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.phone}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Adresse</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.address}</p>
        </div>
      </div>

      <Button variant="outline" onClick={() => router.back()} className="mt-6">
        Zurück zu den Leads
      </Button>

      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LeadDetailPage;
