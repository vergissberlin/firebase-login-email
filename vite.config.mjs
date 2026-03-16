import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/firebase-login-email.ts'),
            name: 'FirebaseLoginEmail',
            fileName: () => 'firebase-login-email.js',
            formats: ['cjs'],
        },
        rollupOptions: {
            external: ['firebase', /^firebase\/.*/],
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
});
