import type { FC } from 'react'
import { useState } from 'react'
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

// Baseline durations in milliseconds
const baselineDurations: Record<string, number> = {
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

function formatTime(s: number) {
  if (s < 1000) return `${s.toFixed(2)} ms`
  const secs = s / 1000
  if (secs < 60) return `${secs.toFixed(2)} s`
  const m = secs / 60
  if (m < 60) return `${m.toFixed(2)} min`
  const h = m / 60
  if (h < 24) return `${h.toFixed(2)} h`
  const d = h / 24
  if (d < 365) return `${d.toFixed(2)} d`
  return `${(d/365).toFixed(2)} y`
}

const App: FC = () => {
  const [stats, recordLatency, reset] = useLatencyStats(allLevels)

  // Adjustable parameters
  const [cpuFreq, setCpuFreq] = useState(3)   // in GHz
  const [l1Size, setL1Size]     = useState(32) // in KB
  const [l2Size, setL2Size]     = useState(256)// in KB
  const [l3Size, setL3Size]     = useState(8)  // in MB

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

  // Compute scaled durations based on parameters
  const getAdjustedDurations = () => {
    const scaleByCpu = 3 / cpuFreq
    return Object.fromEntries(
      Object.entries(baselineDurations).map(([lvl, dur]) => {
        let adjusted = dur * scaleByCpu
        if (lvl === 'L1') adjusted *= (l1Size / 32)
        if (lvl === 'L2') adjusted *= (l2Size / 256)
        if (lvl === 'L3') adjusted *= ((l3Size * 1024) / 8192)
        return [lvl, adjusted]
      })
    ) as Record<string, number>
  }
  const durations = getAdjustedDurations()

  return (
    <div className="app-container">
      <section className="controls">
        <button onClick={reset}>Reset Stats</button>
        <button onClick={randomAccess}>Random Access</button>
      </section>

      {/* Parameter Controls */}
      <section className="parameter-controls">
        <label>
          CPU Clock: {cpuFreq.toFixed(1)} GHz
          <input
            type="range"
            min={1}
            max={5}
            step={0.1}
            value={cpuFreq}
            onChange={e => setCpuFreq(parseFloat(e.target.value))}
          />
        </label>
        <label>
          L1 Cache: {l1Size} KB
          <input
            type="range"
            min={16}
            max={128}
            step={8}
            value={l1Size}
            onChange={e => setL1Size(parseInt(e.target.value))}
          />
        </label>
        <label>
          L2 Cache: {l2Size} KB
          <input
            type="range"
            min={128}
            max={1024}
            step={64}
            value={l2Size}
            onChange={e => setL2Size(parseInt(e.target.value))}
          />
        </label>
        <label>
          L3 Cache: {l3Size} MB
          <input
            type="range"
            min={4}
            max={16}
            step={1}
            value={l3Size}
            onChange={e => setL3Size(parseInt(e.target.value))}
          />
        </label>
      </section>

      {/* NETWORK PANEL */}
      <section className="network-panel">
        <h2>Network</h2>
        <ul>
          {['Net_NYC','Net_UK','Net_AUS'].map(lvl => (
            <li key={lvl}>
              {lvl.replace('Net_','SF→')}: {formatTime(durations[lvl])}
            </li>
          ))}
        </ul>
      </section>

      {/* PCB BOARD */}
      <div className="board-wrapper">
        <Board onNodeClick={recordLatency} durations={durations} />
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

      {/* CHART: pass full stats to show expected vs actual */}
      <section className="chart-section">
        <h2>Click Statistics</h2>
         <Charts stats={stats} />
      </section>
    </div>
  )
}

export default App
