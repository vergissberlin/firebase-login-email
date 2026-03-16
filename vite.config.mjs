import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/firebase-login-email.ts'),
            name: 'FirebaseLoginEmail',
            fileName: (format) =>
                format === 'es' ? 'firebase-login-email.mjs' : 'firebase-login-email.js',
            formats: ['cjs', 'es'],
        },
        rollupOptions: {
            external: ['firebase', /^firebase\/.*/],
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
});
