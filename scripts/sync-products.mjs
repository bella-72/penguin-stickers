import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs-extra";
import path from "path";
import mime from "mime-types";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRODUCTS_DIR = "./products";

async function uploadFolder(folderName) {

    const folderPath = path.join(PRODUCTS_DIR, folderName);

    const files = await fs.readdir(folderPath);

    console.log(`\n📂 ${folderName}`);

    for (const file of files) {

        // يرفع الصور فقط
        if (!/\.(png|jpg|jpeg|webp)$/i.test(file)) continue;

        const filePath = path.join(folderPath, file);

        const stat = await fs.stat(filePath);

        if (!stat.isFile()) continue;

        const fileBuffer = await fs.readFile(filePath);

        const storagePath = `${folderName}/${file}`;

        const contentType =
            mime.lookup(file) || "application/octet-stream";

        const { error } = await supabase.storage
            .from("products")
            .upload(storagePath, fileBuffer, {
                contentType,
                upsert: true,
            });

        if (error) {
            console.log(`❌ ${file}`);
            console.log(error.message);
            continue;
        }

        console.log(`✅ ${file}`);
    }
}

async function main() {

    const folders = await fs.readdir(PRODUCTS_DIR);

    for (const folder of folders) {

        const folderPath = path.join(PRODUCTS_DIR, folder);

        const stat = await fs.stat(folderPath);

        if (!stat.isDirectory()) continue;

        await uploadFolder(folder);
    }

    console.log("\n🎉 Upload Finished!");
}

main();