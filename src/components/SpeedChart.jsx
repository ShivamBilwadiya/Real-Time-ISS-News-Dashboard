import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function SpeedChart({ speedHistory, isDark }) {
  const labels = speedHistory.map((s) => s.time);
  const speeds = speedHistory.map((s) => s.speed);

  const data = {
    labels,
    datasets: [
      {
        label: 'Speed (km/h)',
        data: speeds,
        fill: true,
        borderColor: '#818cf8',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(129, 140, 248, 0.3)');
          gradient.addColorStop(1, 'rgba(129, 140, 248, 0.01)');
          return gradient;
        },
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#818cf8',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#e2e8f0' : '#1e293b',
        bodyColor: isDark ? '#94a3b8' : '#64748b',
        borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.5)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString()} km/h`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#475569' : '#94a3b8',
          maxRotation: 0,
          maxTicksLimit: 6,
          font: { size: 10 },
        },
        border: { display: false },
      },
      y: {
        display: true,
        grid: {
          color: isDark ? 'rgba(71, 85, 105, 0.15)' : 'rgba(203, 213, 225, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#475569' : '#94a3b8',
          font: { size: 10 },
          callback: (val) => `${(val / 1000).toFixed(0)}k`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Activity className={`w-5 h-5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Speed Over Time
        </h3>
        {speeds.length > 0 && (
          <span className={`ml-auto text-xs ${isDark ? 'text-dark-400' : 'text-gray-500'}`}>
            Last {speeds.length} readings
          </span>
        )}
      </div>

      <div className="flex-1 min-h-[200px]">
        {speeds.length > 1 ? (
          <Line data={data} options={options} />
        ) : (
          <div className={`flex items-center justify-center h-full text-sm ${isDark ? 'text-dark-500' : 'text-gray-400'}`}>
            <div className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p>Collecting speed data...</p>
              <p className="text-xs mt-1">Updates every 15 seconds</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
