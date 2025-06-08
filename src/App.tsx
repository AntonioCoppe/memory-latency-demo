import type { FC } from 'react'
import { Board } from './components/Board'
import { Charts } from './components/Charts'
import { useLatencyStats } from './hooks/useLatency'
import './index.css'

const allLevels = [
  'Registers','CPU','L1','L2','L3',
  'RAM','SSD','HDD',
  'Net_NYC','Net_UK','Net_AUS',
  'OS','SCSI','HW','PHYS'
]

const durations: Record<string, number> = {
  Registers:   0.3,   CPU:          0.3,
  L1:           0.9,   L2:          2.8,
  L3:         12.9,   RAM:        120,
  SSD:     10000,   HDD:     550000,
  Net_NYC:4000000, Net_UK:  8100000,
  Net_AUS:18300000, OS:  400000000,
  SCSI:3000000000, HW: 4000000000,
  PHYS:30000000000
}

const sysNames: Record<string,string> = {
  OS: 'OS Reboot',
  SCSI: 'SCSI Timeout',
  HW: 'Hardware Virt',
  PHYS: 'System Reboot'
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(1)} ms`
  const s = ms / 1000
  if (s < 60) return `${s.toFixed(2)} s`
  const m = s / 60
  if (m < 60) return `${m.toFixed(2)} min`
  const h = m / 60
  if (h < 24) return `${h.toFixed(2)} h`
  const d = h / 24
  if (d < 365) return `${d.toFixed(2)} d`
  return `${(d/365).toFixed(2)} y`
}

const App: FC = () => {
  const [stats, increment, reset] = useLatencyStats(allLevels)

  // Spawn 20 random packet clicks
  const randomAccess = () => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLDivElement>('.mem')
    )
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const el = nodes[Math.floor(Math.random() * nodes.length)]
        el.click()
      }, i * 100)
    }
  }

  // Click through every node in order
  const sequentialAccess = () => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLDivElement>('.mem')
    )
    nodes.forEach((el, i) => {
      setTimeout(() => el.click(), i * 150)
    })
  }

  return (
    <div className="app-container">
      {/* TITLE + CONTROLS */}
      <header>
        <h1>Memory Latency Demo</h1>
        <div className="controls">
          <button onClick={randomAccess}>Random Access</button>
          <button onClick={sequentialAccess}>Sequential Access</button>
          <button onClick={reset}>Clear Data</button>
        </div>
      </header>

      {/* MAIN ROW */}
      <section className="main-row">
        {/* NETWORK PANEL */}
        <aside className="network-panel">
          <h2>Network</h2>
          <ul>
            {['Net_NYC','Net_UK','Net_AUS'].map(lvl => (
              <li key={lvl}>
                {lvl.replace('Net_','SF→')}: {formatTime(durations[lvl])}
              </li>
            ))}
          </ul>
        </aside>

        {/* PCB BOARD */}
        <div className="board-wrapper">
          <Board onNodeClick={increment} />
        </div>

        {/* SYSTEM PANEL */}
        <aside className="system-panel">
          <h2>System</h2>
          <ul>
            {['OS','SCSI','HW','PHYS'].map(lvl => (
              <li key={lvl}>
                {sysNames[lvl]}: {formatTime(durations[lvl])}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* CHART */}
      <section className="chart-section">
        <h2>Click Statistics</h2>
        <Charts stats={stats} />
      </section>
    </div>
  )
}

export default App
