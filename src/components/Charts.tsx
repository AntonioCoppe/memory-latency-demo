import type { FC } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { LatencyStats } from '../hooks/useLatency'

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export interface ChartsProps {
  /** latency stats per level including expected and actual totals */
  stats: LatencyStats
}

export const Charts: FC<ChartsProps> = ({ stats }) => {
  const labels = Object.keys(stats)

  // compute average expected and actual latencies
  const expectedData = labels.map(level => {
    const entry = stats[level]
    return entry.count > 0 ? entry.totalExpected / entry.count : 0
  })
  const actualData = labels.map(level => {
    const entry = stats[level]
    return entry.count > 0 ? entry.totalActual / entry.count : 0
  })

  // Chart data
  const data = {
    labels,
    datasets: [
      {
        label: 'Avg Expected (ms)',
        data: expectedData,
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      },
      {
        label: 'Avg Actual (ms)',
        data: actualData,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  }

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Avg Latency per Memory Level' }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Latency (ms)' }
      },
      x: {
        title: { display: true, text: 'Memory Level' }
      }
    }
  }

  return <Bar data={data} options={options} />
}