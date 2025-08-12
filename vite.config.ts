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
   
    // Build optimizations
    build: {
      target: 'es2020',
      minify: 'terser',
      sourcemap: isDev,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunks
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
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              if (id.includes('react-router')) {
                return 'router';
              }
              // Other vendor libraries
              return 'vendor';
            }
            
            // Theme-specific chunks for better code splitting
            if (id.includes('/theme/') || id.includes('/hooks/useTheme') || id.includes('/hooks/useThemeSelectors')) {
              if (id.includes('ThemeProvider') || id.includes('useTheme.') || id.includes('useThemeClassName')) {
                return 'theme-core'; // Critical theme functionality
              }
              if (id.includes('ThemeToggle') || id.includes('ThemeAware') || id.includes('ThemePerformance')) {
                return 'theme-components'; // Theme UI components
              }
              if (id.includes('themeUtils') || id.includes('themeBundleOptimizer') || id.includes('themeChunkSplitter')) {
                return 'theme-utils'; // Theme utilities
              }
              if (id.includes('LazyTheme') || id.includes('useThemeSelectors')) {
                return 'theme-advanced'; // Advanced theme features
              }
              return 'theme-misc'; // Other theme-related code
            }
            
            // Component chunks
            if (id.includes('/components/sections/')) {
              return 'sections';
            }
            if (id.includes('/components/ui/')) {
              return 'ui';
            }
            if (id.includes('/utils/') && !id.includes('theme')) {
              return 'utils';
            }
            
            // Hook chunks (non-theme)
            if (id.includes('/hooks/') && !id.includes('theme')) {
              return 'hooks';
            }
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
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
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd ? ['console.log', 'console.info'] : [],
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      },
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
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
