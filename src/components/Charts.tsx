import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ChartsProps {
  // keys will match your dataLat values, e.g. 'L1', 'L2', 'RAM', etc.
  stats: Record<string, number>
}

export const Charts: React.FC<ChartsProps> = ({ stats }) => {
  // Extract labels and counts in a stable order
  const labels = Object.keys(stats)
  const data = {
    labels,
    datasets: [
      {
        label: 'Click Count',
        data: labels.map((l) => stats[l]),
        backgroundColor: 'rgba(255, 235, 59, 0.8)', // yellow bars
        borderColor:     'rgba(255, 235, 59, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Memory Node Click Stats' }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Clicks' },
        ticks: { color: '#eee' },
        grid:  { color: '#444' }
      },
      x: {
        title: { display: true, text: 'Memory Level' },
        ticks: { color: '#eee' },
        grid:  { color: '#444' }
      }
    }
  }

  return <Bar options={options} data={data} />
}
