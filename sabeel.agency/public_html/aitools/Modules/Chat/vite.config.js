import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'Modules/Chat/Resources/sass/app.scss',
                'Modules/Chat/Resources/js/app.js',
            ],
            refresh: true,
        }),
        react(),
    ],
});
