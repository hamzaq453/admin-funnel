'use client';
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/leads');
        if (!response.ok) throw new Error('Fehler beim Abrufen der Leads');

        const data = await response.json();
        setLeads(data.allLeads);
      } catch (error) {
        console.error('Fehler beim Abrufen der Leads:', error);
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
      console.error('Fehler beim Löschen der Leads:', error);
    }
  };

  const handleDownloadSelected = () => {
    const selectedData = leads.filter((lead) => selectedLeads.has(lead.id));
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'ausgewählte_leads.xlsx');
  };

  const isAnyLeadSelected = selectedLeads.size > 0;

  const filteredLeads = leads.filter((lead) =>
    lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    lead.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white w-full p-4 shadow-md rounded-lg">
      <div className="flex items-center justify-between flex-wrap">
        <h1 className="text-xl font-semibold mt-3">Leads</h1>
        {/* Conditionally rendered delete button or empty space */}
        {isAnyLeadSelected ? (
          <Button onClick={handleDeleteSelected} variant="outline" className="bg-red-100 text-red-600 border border-red-600 hover:bg-red-200">
            Ausgewählte Löschen
          </Button>
        ) : (
          <div></div>
        )}
      </div>

      {/* Search and Download Section */}
      <div className="my-4 flex flex-col md:flex-row items-center justify-end md:space-x-2 space-y-2 md:space-y-0 w-full">
        <Input
          placeholder="Suchen..." // Shorter placeholder in German
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-64"
        />
        
        <Button onClick={handleDownloadSelected} variant="ghost" className="w-full md:w-auto flex items-center justify-center">
          <Download className="text-gray-500" />
          <span className="ml-1">Ausgewählte Herunterladen</span>
        </Button>
      </div>

        <main className="flex flex-col w-full">
          <div className="border rounded-lg shadow-sm w-full overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loader"></div>
              </div>
            ) : (
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
                    <TableHead>Vollständiger Name</TableHead>
                    <TableHead className="hidden md:table-cell">Kundenerfahrung</TableHead>
                    <TableHead className="hidden md:table-cell">Kontaktzeit</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead className="hidden md:table-cell">E-Mail</TableHead>
                    <TableHead className="hidden lg:table-cell">Adresse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
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
                      <TableCell className="hidden md:table-cell">{lead.customerExperience}</TableCell>
                      <TableCell className="hidden md:table-cell">{lead.contactTime}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">{lead.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </main>
      </div>

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
    </>
  );
};

export default LeadsPage;
