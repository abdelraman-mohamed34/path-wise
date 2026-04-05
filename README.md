# 📍 GeoVision | Next-Generation Interactive Mapping & Navigation

**GeoVision** is a high-performance map application built with **Next.js 15**, designed to provide a seamless user experience for navigation and location discovery. It features a robust routing system, real-time location tracking, and a highly interactive UI optimized for both mobile and desktop users.

---

## 🌐 Live Demo
<a href='https://path-wise-one.vercel.app/' target='_blank'>search-engine/</a>


---

## 🚀 Tech Stack

Selected for scalability, performance, and modern developer experience:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
* **Mapping:** [MapLibre GL](https://maplibre.org/) & [React Map GL](http://visgl.github.io/react-map-gl/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Data Fetching:** [Axios](https://axios-http.com/)

---

## ✨ Key Features

### 🗺️ Intelligent Routing System
* **Dynamic Routes:** Real-time driving directions calculated via **MapTiler API**.
* **Adaptive Camera Modes:** Supports **Overview Mode** for full-path visibility and **Navigation Mode** for a focused 3D perspective with high zoom on the user's position.
* **High-Visibility Paths:** Routes are rendered using a **Double-layered Polyline** (white outline + blue core) to ensure maximum contrast across all map styles.

### 🔍 Advanced Search & Discovery
* **Smart Debouncing:** Search inputs are debounced to optimize API usage and provide a smooth typing experience.
* **Persistent History:** Recent searches are stored in **LocalStorage** for instant access during future sessions.
* **Reverse Geocoding:** Get precise location details instantly by clicking anywhere on the map.

### 📱 Premium Interactive UI
* **Responsive Sidebar:** A mobile-first dynamic drawer that supports **Drag-to-resize** gestures powered by Framer Motion.
* **Theme Synchronization:** Full support for **Dark & Light Modes**, with map tiles and layer colors updating dynamically to match the system theme.

### ⚡ Performance Engineering
* **Declarative Mapping:** Map layers and sources are fully reactive, driven by the centralized Redux state.
* **Optimized Rendering:** Heavy use of `React.memo`, `useCallback`, and `useMemo` to maintain 60FPS performance during map interactions and sidebar transitions.
