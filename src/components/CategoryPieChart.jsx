import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({ articles, isDark }) {
  const sourceCounts = {};
  articles.forEach((article) => {
    const source = article.source?.name || 'Unknown';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });

  const labels = Object.keys(sourceCounts).slice(0, 7);
  const values = labels.map((l) => sourceCounts[l]);
  const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors.slice(0, labels.length).map((c) => c + '40'),
      borderColor: colors.slice(0, labels.length),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#94a3b8' : '#64748b',
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 8,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: isDark ? '#e2e8f0' : '#1e293b',
        bodyColor: isDark ? '#94a3b8' : '#64748b',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className={`w-5 h-5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>News Sources</h3>
      </div>
      <div className="flex-1 min-h-[200px]">
        {labels.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className={`flex items-center justify-center h-full text-sm ${isDark ? 'text-dark-500' : 'text-gray-400'}`}>
            <div className="text-center">
              <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No data to display</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
