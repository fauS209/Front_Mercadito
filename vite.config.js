import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Define el directorio de salida para los archivos construidos
    rollupOptions: {
      input: 'index.html', // Asegúrate de que este sea el archivo de entrada correcto
    },
    sourcemap: true, // Agrega un mapa de origen para debugging (opcional)
  },
  server: {
    open: true, // Abre el navegador automáticamente al iniciar el servidor
  },
});
