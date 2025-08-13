import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isAnalyze = mode === 'analyze';
  
  return {
    base: '/',
    define: {
      __DEV__: isDev,
      __PROD__: isProd
    },
    plugins: [
      react(),
      tsconfigPaths(),
      ...(isAnalyze ? [
        visualizer({
          filename: 'dist/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap'
        })
      ] : [])
    ],
   
    // Build optimizations - simplified to avoid initialization issues
    build: {
      target: 'es2020',
      minify: 'esbuild', // Changed from terser to esbuild for better compatibility
      sourcemap: isDev,
      rollupOptions: {
        treeshake: false, // Disable tree shaking to prevent initialization issues
        output: {
          // Simplified chunk splitting to avoid circular dependencies
          manualChunks: (id) => {
            // Only split vendor chunks to avoid complex dependencies
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('framer-motion')) {
                return 'motion';
              }
              if (id.includes('three') || id.includes('@react-three')) {
                return 'three';
              }
              return 'vendor';
            }
            // Keep all app code in main chunk to avoid initialization issues
            return undefined;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') ?? [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js'
        }
      },
      // Removed terser options since we're using esbuild now
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: false, // Disable CSS code splitting to avoid issues
      reportCompressedSize: false,
      assetsInlineLimit: 4096
    },
  
    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'three',
        '@react-three/fiber',
        '@react-three/drei'
      ]
    },

    // Development server
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      hmr: {
        overlay: true
      }
    },

    // Preview server
    preview: {
      port: 4173,
      host: true,
      cors: true
    },

    // CSS
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/styles/variables.scss";`
        }
      }
    }
  };
});
