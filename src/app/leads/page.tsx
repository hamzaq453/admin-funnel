'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Lead {
  id: number;
  jobImportance: string;
  customerExperience: string;
  contactTime: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/leads');
        if (!response.ok) throw new Error('Failed to fetch leads');

        const data = await response.json();
        setLeads(data.allLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleSelectLead = (id: number) => {
    setSelectedLeads((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(id)) {
        updatedSelected.delete(id);
      } else {
        updatedSelected.add(id);
      }
      return updatedSelected;
    });
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        Array.from(selectedLeads).map((id) =>
          fetch(`/api/leads/${id}`, { method: 'DELETE' })
        )
      );
      setLeads(leads.filter((lead) => !selectedLeads.has(lead.id)));
      setSelectedLeads(new Set());
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
  };

  const handleDownloadSelected = () => {
    const selectedData = leads.filter((lead) => selectedLeads.has(lead.id));
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'selected_leads.xlsx');
  };

  const isAnyLeadSelected = selectedLeads.size > 0;

  // Filtered leads based on search query
  const filteredLeads = leads.filter((lead) =>
    lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    lead.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white w-full p-4 shadow-md rounded-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Leads</h1>
          {isAnyLeadSelected ? (
            <Button onClick={handleDeleteSelected} variant="outline" className="bg-red-100 text-red-600 border border-red-600 hover:bg-red-200">
              Delete Selected
            </Button>
          ) : (
            <Button variant="outline">
              <Link href="/newLeads">New</Link>
            </Button>
          )}
        </div>

        <div className="my-4 flex items-center justify-end space-x-2">
          <Input
            placeholder="Search this list..."
            type="text"
            value={searchQuery} // Bind searchQuery state to Input
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
          />
          <Button variant="ghost">
            <Search className="text-gray-500" />
          </Button>
          <Button onClick={handleDownloadSelected} variant="ghost">
            <Download className="text-gray-500" />
            <span className="ml-1">Download Selected</span>
          </Button>
        </div>

        <main className="flex flex-col w-full">
          <div className="border rounded-lg shadow-sm w-full overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedLeads(e.target.checked ? new Set(leads.map((lead) => lead.id)) : new Set())
                      }
                      checked={selectedLeads.size === leads.length && leads.length > 0}
                    />
                  </TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Customer Experience</TableHead>
                  <TableHead>Contact Time</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead, index) => (
                    <TableRow key={lead.id} className="text-[16px]">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/leads/${lead.id}`} className="text-blue-500 underline">
                          {lead.fullName}
                        </Link>
                      </TableCell>
                      <TableCell>{lead.customerExperience}</TableCell>
                      <TableCell>{lead.contactTime}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.address}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </>
  );
};

export default LeadsPage;
