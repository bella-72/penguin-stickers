import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  const { data, error } = await supabase
    .from("categories")
    .select("*");

  if (error) {
    console.log("❌ Error:");
    console.log(error);
    return;
  }

  console.log("✅ Connected Successfully!");
  console.log(data);
}

testConnection();