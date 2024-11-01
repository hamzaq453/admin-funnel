'use client';
import { useEffect, useState } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

// Define specific types for analytics data structure
interface SessionSourceData {
  Direct: number;
  Organic: number;
  Referral: number;
}

interface DeviceCategoryData {
  Desktop: number;
  Mobile: number;
  Tablet: number;
}

interface DimensionValue {
  value: string;
}

interface MetricValue {
  value: string;
}

interface AnalyticsRow {
  dimensionValues: DimensionValue[];
  metricValues: MetricValue[];
}

interface AnalyticsData {
  activeUsers: number;
  newUsers: number;
  engagementRate: string;
  eventCount: number;
  averageSessionDuration: string;
  bounceRate: string;
  sessions: number;
  screenPageViews: number;
  sessionsPerUser: string;
  totalRevenue: number;
  country: string;
  city: string;
  deviceCategory: DeviceCategoryData;
  platform: string;
  sessionSource: SessionSourceData;
  sessionMedium: string;
  landingPage: { url: string; views: number }[];
  demographics: Record<string, number>;
}

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics');
        const result = await response.json();

        console.log("API Response on Frontend:", result);

        let totalSessionDuration = 0;
        let count = 0;

        const sessionSourceData: SessionSourceData = { Direct: 0, Organic: 0, Referral: 0 };
        const deviceCategoryData: DeviceCategoryData = { Desktop: 0, Mobile: 0, Tablet: 0 };
        const countryData: Record<string, number> = {};

        result.rows.forEach((row: AnalyticsRow) => {
          const duration = parseFloat(row.metricValues[3]?.value || '0');
          if (duration > 0) {
            totalSessionDuration += duration;
            count += 1;
          }

          const source = row.dimensionValues[5]?.value || '(not set)';
          if (source === '(direct)') sessionSourceData.Direct += 1;
          else if (source === 'organic') sessionSourceData.Organic += 1;
          else if (source === 'referral') sessionSourceData.Referral += 1;

          const device = row.dimensionValues[3]?.value.toLowerCase();
          if (device === 'desktop') deviceCategoryData.Desktop += 1;
          else if (device === 'mobile') deviceCategoryData.Mobile += 1;
          else if (device === 'tablet') deviceCategoryData.Tablet += 1;

          const country = row.dimensionValues[1]?.value || 'Unknown';
          countryData[country] = (countryData[country] || 0) + 1;
        });

        const averageSessionDuration = count > 0 ? totalSessionDuration / count : 0;

        const parsedData: AnalyticsData = {
          activeUsers: parseInt(result.rows[0].metricValues[0].value),
          newUsers: parseInt(result.rows[0].metricValues[1].value),
          engagementRate: `${parseFloat(result.rows[0].metricValues[2].value).toFixed(2)}%`,
          averageSessionDuration: `${Math.floor(averageSessionDuration / 60)}m ${Math.floor(averageSessionDuration % 60)}s`,
          bounceRate: `${parseFloat(result.rows[0].metricValues[4].value).toFixed(2)}%`,
          eventCount: parseInt(result.rows[0].metricValues[5].value),
          sessions: parseInt(result.rows[0].metricValues[6].value),
          screenPageViews: parseInt(result.rows[0].metricValues[7].value),
          sessionsPerUser: `${parseFloat(result.rows[0].metricValues[8].value).toFixed(2)}`,
          totalRevenue: parseFloat(result.rows[0].metricValues[9].value),
          country: result.rows[0].dimensionValues[1].value,
          city: result.rows[0].dimensionValues[2].value,
          deviceCategory: deviceCategoryData,
          platform: result.rows[0].dimensionValues[4]?.value || 'N/A',
          sessionSource: sessionSourceData,
          sessionMedium: result.rows[0].dimensionValues[6]?.value || 'N/A',
          landingPage: result.rows.map((row: AnalyticsRow) => ({
            url: row.dimensionValues[7]?.value || 'N/A',
            views: parseInt(row.metricValues[7]?.value || '0'),
          })),
          demographics: countryData,
        };

        setData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading data...</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      
      {data && (
        <>
          <TrafficDemographicsCountries data={data} />
          <TrafficDemographics data={data} />
          <HeroMetrics data={data} />
          <EngagementBehavior data={data} />
          <TopLandingPages data={data} />
        </>
      )}
    </div>
  );}

const HeroMetrics = ({ data }: { data: AnalyticsData }) => {
  // Directly use averageSessionDuration as provided by GA4
  const averageEngagementTime = `${Math.floor(parseFloat(data.averageSessionDuration) / 60)}m ${Math.floor(parseFloat(data.averageSessionDuration) % 60)}s`;

  const metrics = [
    { label: 'Active Users', value: data.activeUsers },
    { label: 'New Users', value: data.newUsers },
    { label: 'Sessions', value: data.sessions },
    { label: 'Average Engagement Time', value: averageEngagementTime },
  ];

  return (
    <section className="grid grid-cols-2 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-600">{metric.label}</h2>
          <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
        </div>
      ))}
    </section>
  );
};




const EngagementBehavior = ({ data }: { data: AnalyticsData }) => {
  const behaviorMetrics = [
    { label: 'Engagement Rate', value: data.engagementRate },
    { label: 'Bounce Rate', value: data.bounceRate },
    { label: 'Sessions per User', value: data.sessionsPerUser },
    { label: 'Average Session Duration', value: data.averageSessionDuration },
    { label: 'Event Count', value: data.eventCount },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Engagement & Behavior</h2>
      <div className="grid grid-cols-2 gap-4">
        {behaviorMetrics.map((metric, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-md">
            <h3 className="text-md font-semibold text-gray-600">{metric.label}</h3>
            <p className="text-xl font-bold text-gray-800">{metric.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const TrafficDemographicsCountries = ({ data }: { data: AnalyticsData }) => {
  const trafficData = {
    labels: ['Direct', 'Organic', 'Referral'],
    datasets: [
      {
        data: [
          data.sessionSource.Direct,
          data.sessionSource.Organic,
          data.sessionSource.Referral,
        ],
        backgroundColor: ['#4A90E2', '#7ED321', '#F8E71C'],
      },
    ],
  };

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [
          data.deviceCategory.Desktop,
          data.deviceCategory.Mobile,
          data.deviceCategory.Tablet,
        ],
        backgroundColor: ['#50E3C2', '#F5A623', '#9013FE'],
      },
    ],
  };

  // Prepare demographics data for the pie chart
  const demographicsLabels = Object.keys(data.demographics);
  const demographicsValues = Object.values(data.demographics);
  const demographicsColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; // Add more colors if needed

  const demographicsData = {
    labels: demographicsLabels,
    datasets: [
      {
        data: demographicsValues,
        backgroundColor: demographicsColors.slice(0, demographicsLabels.length),
      },
    ],
  };

  return (
    <section className="grid grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Traffic Sources</h2>
        <div style={{ width: '200px', height: '200px', margin: '0 auto' }}>
          <Pie data={trafficData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Device Categories</h2>
        <div style={{ width: '200px', height: '200px', margin: '0 auto' }}>
          <Doughnut data={deviceData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">User Demographics</h2>
        <div style={{ width: '200px', height: '200px', margin: '0 auto' }}>
          <Pie data={demographicsData} />
        </div>
      </div>
    </section>
  );
};


const TrafficDemographics = ({ data }: { data: AnalyticsData }) => {
  const trafficData = {
    labels: ['Direct', 'Organic', 'Referral'],
    datasets: [
      {
        data: [
          data.sessionSource.Direct,
          data.sessionSource.Organic,
          data.sessionSource.Referral,
        ],
        backgroundColor: ['#4A90E2', '#7ED321', '#F8E71C'],
      },
    ],
  };

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [
          data.deviceCategory.Desktop,
          data.deviceCategory.Mobile,
          data.deviceCategory.Tablet,
        ],
        backgroundColor: ['#50E3C2', '#F5A623', '#9013FE'],
      },
    ],
  };

  return (
    <section className="grid grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Traffic Sources</h2>
        <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
          <Pie data={trafficData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Device Categories</h2>
        <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
          <Doughnut data={deviceData} />
        </div>
      </div>
    </section>
  );
};


const TopLandingPages = ({ data }: { data: AnalyticsData }) => {
  const topPages = data.landingPage.slice(0, 5);

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Landing Pages</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-600 font-semibold">
            <th className="p-2">Page</th>
            <th className="p-2">Views</th>
          </tr>
        </thead>
        <tbody>
          {topPages.map((page, index) => (
            <tr key={index} className="text-gray-800 border-t">
              <td className="p-2">{page.url}</td>
              <td className="p-2 text-right">{page.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AnalyticsPage;
