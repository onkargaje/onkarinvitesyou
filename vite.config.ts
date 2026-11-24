import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const supabaseUrl = env.VITE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL;

  if (supabaseUrl) {
    process.env.VITE_SUPABASE_URL ??= supabaseUrl;
  }

  return {
    nitro: { preset: "vercel" },
    tanstackStart: {
      server: { entry: "server" },
    },
    vite: {
      server: {
        allowedHosts: true,
      },
    },
  };
});
