import type { FC } from 'react'
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

export interface ChartsProps {
  /** click counts per memory level */
  stats: Record<string, number>
}

export const Charts: FC<ChartsProps> = ({ stats }) => {
  const labels = Object.keys(stats)
  const data = {
    labels,
    datasets: [
      {
        label: 'Click Count',
        data: labels.map((l) => stats[l]),
        backgroundColor: 'rgba(255, 235, 59, 0.8)',
        borderColor:     'rgba(255, 235, 59, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Memory Node Click Stats', color: '#eee' }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Clicks', color: '#eee' },
        ticks: { color: '#eee' },
        grid:  { color: '#444' }
      },
      x: {
        title: { display: true, text: 'Memory Level', color: '#eee' },
        ticks: { color: '#eee' },
        grid:  { color: '#444' }
      }
    }
  }

  return <Bar options={options} data={data} />
}
