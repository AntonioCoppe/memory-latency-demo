import React from 'react'
import { Board } from './components/Board'
import { Charts } from './components/Charts'
import { Legend } from './components/Legend'
import { useLatencyStats } from './hooks/useLatency'
import './index.css'

const allLevels = [
  'Registers','CPU','L1','L2','L3',
  'RAM','SSD','HDD',
  'Net_NYC','Net_UK','Net_AUS',
  'OS','SCSI','HW','PHYS'
]

export default function App() {
  const [stats, increment, resetStats] = useLatencyStats(allLevels)

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  const simulateSequential = async () => {
    const elems = Array.from(document.querySelectorAll<HTMLDivElement>('#board .mem'))
    for (const el of elems) {
      el.click()
      await sleep(150)
    }
  }

  const simulateRandom = async () => {
    const elems = Array.from(document.querySelectorAll<HTMLDivElement>('#board .mem'))
    for (let i = 0; i < 50; i++) {
      elems[Math.floor(Math.random() * elems.length)].click()
      await sleep(150)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      {/* Legend */}
      <Legend />

      {/* Controls */}
      <div style={{ margin: '12px 0' }}>
        <button onClick={simulateSequential}>Sequential Access</button>
        <button onClick={simulateRandom} style={{ margin: '0 8px' }}>
          Random Access
        </button>
        <button onClick={resetStats}>
          Clear Data
        </button>
      </div>

      {/* Board */}
      <div style={{ width:'1200px' }}>
        <Board onNodeClick={increment} />
      </div>

      {/* Chart */}
      <div style={{ width:'1200px', marginTop:'36px' }}>
        <Charts stats={stats} />
      </div>
    </div>
  )
}
