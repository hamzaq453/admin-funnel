import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 p-2">
      <h1 className="text-3xl font-semibold text-gray-800 mt-10">Willkommen!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-20 w-full max-w-5xl px-4">
        {/* Leads Section */}
        <div className="flex flex-col items-start p-14 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Leads</h2>
          <p className="text-gray-700 mb-6">
            Verwalten und anzeigen Ihrer Leads. Behalten Sie Kundeninformationen im Auge, 
            überwachen Sie den Status und stellen Sie einen reibungslosen Nachverfolgungsprozess sicher.
          </p>
          <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-100">
            <Link href="/leads">Zu Leads</Link>
          </Button>
        </div>

        {/* Analytics Section */}
        <div className="flex flex-col items-start p-14 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Analysen</h2>
          <p className="text-gray-700 mb-6">
            Erkunden Sie die Analysen, um die Leistung Ihrer Leads zu verstehen. 
            Analysieren Sie wichtige Kennzahlen und treffen Sie datenbasierte Entscheidungen zur Verbesserung der Ergebnisse.
          </p>
          <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-100">
            <Link href="/analytics">Zu Analysen</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
