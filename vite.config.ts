import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // The only chunks above the default 500 kB limit are the static JSON
    // dataset chunks (svu-data, lo-data). They are pure data (~260-380 kB
    // gzipped), split per franchise, and only loaded on their own routes.
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor libraries: keep the heavy charting stack separate from
          // the core React runtime so chart code only loads with chart pages.
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/](recharts|d3-[a-z-]+|victory-vendor|react-smooth|recharts-scale|lodash|eventemitter3)[\\/]/.test(id)) {
              return 'vendor-charts'
            }
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
              return 'vendor-react'
            }
            return undefined
          }
          // Dataset chunks: SVU data loads on SVU routes, L&O data on /lo routes.
          if (id.includes('src/data/lo_')) return 'lo-data'
          if (id.includes('src/data/')) return 'svu-data'
          return undefined
        },
      },
    },
  },
})
