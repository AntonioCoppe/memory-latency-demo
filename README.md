# Memory Latency Demo

An interactive, web-based simulation that visualizes the enormous performance differences between CPU registers, multiple cache levels, main memory, SSD/HDD, network round-trips, and full system reboots—laid out on a detailed, PCB-style motherboard diagram.

![Preview of Memory Latency Demo](./public/preview.png)

---

## 🚀 Live Demo

👉 [https://antonioCoppe.github.io/memory-latency-demo/](https://antonioCoppe.github.io/memory-latency-demo/)

---

## 🔍 Overview

**Memory Latency Demo** helps developers and students build an intuitive understanding of how access times grow by orders of magnitude as you move further from the CPU core:

- **CPU Registers:** ~0.3 ns  
- **L1/L2/L3 Caches:** ~1–13 ns  
- **DRAM (RAM):** ~120 ns  
- **NVMe SSD / HDD:** ~50 µs – 10 ms  
- **Network (SF→NYC/UK/AUS):** ~40–183 ms  
- **System Reboots & Timeouts:** seconds → minutes → years  

Click any memory node to launch a little “packet” that animates back to the CPU socket in proportionally accurate (log-scaled) time.

---

## ✨ Key Features

- **Interactive Nodes:**  
  Click on “Regs”, “L1”, “RAM”, “SSD”, “SF→NYC”, “OS Reboot” and more to fire an animated packet at realistic speed.

- **Accurate Time Scaling:**  
  Visualizes sub-nanosecond to multi-year latencies on a single interactive canvas.

- **PCB-Style Layout:**  
  Modeled after a real motherboard with copper-trace background, slot graphics, and component clusters.

- **Network & System Panels:**  
  Sidebar “server rack” and “console” panels display static latency values in human-readable units (ms, s, min, d, y).

- **Real-Time Charts:**  
  Click counters feed into a live Chart.js bar graph to show which nodes you queried most.

- **Persistent Stats:**  
  Your click counts are saved in `localStorage`—reload and your stats remain.

- **Themed & Responsive:**  
  Dark-mode by default, mobile-friendly, ARIA-compliant, and keyboard-accessible.

---

## 🛠 Tech Stack

- **Framework:** React + TypeScript  
- **Bundler:** Vite  
- **Styling:** CSS Modules with custom PCB and panel styles  
- **Animations:** Web Animations API  
- **Charts:** Chart.js & react-chartjs-2  
- **Tour (Tutorial):** Shepherd.js  
- **Testing:** Jest & React Testing Library  
- **CI/CD:** GitHub Actions (build, test, deploy)  
- **Hosting:** GitHub Pages  

---

## 📦 Getting Started Local Development

### Prerequisites

- **Node.js** ≥ 16.x  
- **npm** ≥ 8.x  

### 1. Clone the repository

git clone https://github.com/AntonioCoppe/memory-latency-demo.git
cd memory-latency-demo

### 2. Install dependencies

npm install

### 3. Run the development server

npm run dev

### 4. Running Tests

npm run test

### Build for production

npm run build

### Deploy to GitHub Pages

npm run deploy
Changes will publish automatically at https://antonioCoppe.github.io/memory-latency-demo/.

## 🚀 Why This Matters

Modern software performance is dominated by memory access costs. This demo makes abstract latency numbers tangible—so you can design faster, more efficient systems and understand the real-world impact of your code’s memory behavior.