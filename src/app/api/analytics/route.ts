// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
const PROPERTY_ID = '465621104'; // replace with your GA4 property ID

async function fetchAnalyticsData() {
  const auth = new GoogleAuth({
    scopes: SCOPES,
    keyFile: path.join(process.cwd(), 'src/app/secret.json'), // Ensure this path is correct
  });

  const analyticsDataClient = google.analyticsdata({
    version: 'v1beta',
    auth,
  });

  const response = await analyticsDataClient.properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
    },
  });

  return response.data;
}

// Export a named GET function instead of default export
export async function GET() {
  try {
    const data = await fetchAnalyticsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ message: 'Error fetching analytics data' }, { status: 500 });
  }
}
