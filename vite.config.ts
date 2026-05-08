import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // Optimize JSX runtime
        jsxRuntime: 'automatic',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/contexts': path.resolve(__dirname, './src/contexts'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/styles': path.resolve(__dirname, './src/styles'),
        '@/data': path.resolve(__dirname, './src/data'),
      },
    },
    // Static asset handling configuration
    publicDir: 'public',
    assetsInclude: ['**/*.pdf'],
    build: {
      // Ensure assets are properly copied to dist
      copyPublicDir: true,
      // Target modern browsers for smaller bundles
      target: 'es2020',
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Enable minification (esbuild is faster than terser)
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // Keep PDF files in root of dist for easy access
          assetFileNames: assetInfo => {
            if (assetInfo.name?.endsWith('.pdf')) {
              return '[name][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
          // Optimize chunk splitting for better caching
          manualChunks: id => {
            // Vendor chunks for better caching
            if (id.includes('node_modules')) {
              // React and related libraries
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              // Framer Motion (animation library - can be large)
              if (id.includes('framer-motion')) {
                return 'vendor-animation';
              }
              // Other vendor dependencies
              return 'vendor';
            }
            // Split interactive components into separate chunk
            if (id.includes('/components/interactive/')) {
              return 'interactive';
            }
            // Split section components into separate chunk
            if (id.includes('/components/sections/')) {
              return 'sections';
            }
          },
        },
      },
      // Enable source maps based on environment variable
      sourcemap: env.VITE_SOURCEMAP === 'true',
      // Optimize CSS
      cssCodeSplit: true,
      cssMinify: true,
    },
    server: {
      // Configure MIME types for development server
      headers: {
        'Cache-Control': 'public, max-age=31536000',
      },
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react',
        'date-fns',
        'react-hook-form',
      ],
    },
    // Define environment variables that should be available
    define: {
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version || '0.0.0'
      ),
    },
  };
});
