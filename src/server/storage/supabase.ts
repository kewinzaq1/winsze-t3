import { StorageClient } from "@supabase/storage-js";
import { env } from "src/env/server.mjs";

export const storageClient = new StorageClient(env.STORAGE_URL, {
  apikey: env.STORAGE_SERVICE_KEY,
  Authorization: `Bearer ${env.STORAGE_SERVICE_KEY}`,
});
