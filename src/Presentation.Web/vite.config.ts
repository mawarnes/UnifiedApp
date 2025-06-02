import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
//export default defineConfig({
//    plugins: [react()],
//    mode: () => { }
//});

export default defineConfig(({ mode }) => {
    // Load all env variables for the current mode
    const env = loadEnv(mode, process.cwd(), "");

    // Filter and expose only TR_ variables
    const trEnv = Object.keys(env)
        .filter((key) => key.startsWith("REACT_"))
        .reduce((prev, key) => {
            prev[`import.meta.env.${key}`] = JSON.stringify(env[key]);
            return prev;
        }, {} as Record<string, string>);

    return {
        plugins: [react()],
        define: {
            ...trEnv,
        },
    };
});