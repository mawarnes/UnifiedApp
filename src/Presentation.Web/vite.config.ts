//import { defineConfig } from 'vite';
//import plugin from '@vitejs/plugin-react';

//// https://vitejs.dev/config/
//export default defineConfig({
//    plugins: [plugin()],
//    server: {
//        port: 60284,
//    }
//})

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
});
