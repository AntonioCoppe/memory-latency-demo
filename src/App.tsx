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

export default function App() {
  // ↳ state + persistent increment
  const [stats, increment] = useLatencyStats(allLevels)

  // sleep helper
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // Sequential: walk the DOM in render order
  const simulateSequential = async () => {
    const elems = Array.from(
      document.querySelectorAll<HTMLDivElement>('#board .mem')
    )
    for (const el of elems) {
      el.click()
      await sleep(150)
    }
  }

  // Random: fire 50 random accesses
  const simulateRandom = async () => {
    const elems = Array.from(
      document.querySelectorAll<HTMLDivElement>('#board .mem')
    )
    for (let i = 0; i < 50; i++) {
      const el = elems[Math.floor(Math.random() * elems.length)]
      el.click()
      await sleep(150)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Controls */}
      <div style={{ margin: '20px' }}>
        <button onClick={simulateSequential}>Sequential Access</button>
        <button onClick={simulateRandom} style={{ marginLeft: '8px' }}>
          Random Access
        </button>
      </div>

      {/* Board & Chart */}
      <div style={{ width: '1200px' }}>
        <Board onNodeClick={increment} />
      </div>
      <div style={{ width: '1200px', marginTop: '40px' }}>
        <Charts stats={stats} />
      </div>
    </div>
  )
}
