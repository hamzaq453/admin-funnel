'use client'
import { useEffect, useState } from 'react';

interface AnalyticsData {
  rows?: Array<{ dimensionValues: [{ value: string }], metricValues: [{ value: string }] }>;
}

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics');
        const result = await response.json();

        // Ensure `rows` is an array before setting data
        setData(result && result.rows ? result : { rows: [] });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="analytics">
      <h2>Website Analytics</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : data && data.rows && data.rows.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Page Path</th>
              <th>Page Views</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index}>
                <td>{row.dimensionValues[0].value}</td>
                <td>{row.metricValues[0].value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AnalyticsPage;
