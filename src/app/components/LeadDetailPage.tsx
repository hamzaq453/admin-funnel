'use client'
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
  const [status, setStatus] = useState('New'); // Default to 'New' initially
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/leads/${id}`);
        if (!response.ok) throw new Error('Failed to fetch lead');

        const data = await response.json();
        setLead(data.lead);
        setStatus(data.lead.status || 'New'); // Default to 'New' if no status is set
      } catch (error) {
        console.error('Error fetching lead:', error);
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
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
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
        throw new Error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!lead) return <p>Lead not found</p>;

  return (
    <div className="max-w-full ml-2 bg-white p-2 rounded-lg shadow-md mt-10">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Lead Details</h1>
        <Button
          variant="outline"
          onClick={deleteLead}
          className="bg-red-100 text-red-600 border border-red-600 hover:bg-red-200"
        >
          Delete
        </Button>
      </header>

      {/* Status Buttons */}
      <div className="flex  space-x-4 mb-6">
        {['New', 'Pending', 'In Progress', 'Approved', 'Rejected'].map((option) => (
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
            Save
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 border-t">
      <div>
          <label className="text-gray-500 text-sm">Name</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.fullName}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Job Importance</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.jobImportance}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Customer Experience</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.customerExperience}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Contact Time</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.contactTime}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Email</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.email}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Phone</label>
          <p className="text-gray-800 text-lg font-semibold">{lead.phone}</p>
        </div>
        <div>
          <label className="text-gray-500 text-sm">Address</label>
          <p className="text-gray-800 text-lg font-semibold ">{lead.address}</p>
        </div>
      </div>

      <Button variant="outline" onClick={() => router.back()} className="mt-6 ">
        Back to Leads
      </Button>
    </div>
  );
};

export default LeadDetailPage;
