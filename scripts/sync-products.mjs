import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs-extra";
import path from "path";
import mime from "mime-types";
import slugify from "slugify";
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRODUCTS_DIR = "./products";
async function getOrCreateCategory(folderName) {
  const slug = slugify(folderName, { lower: true });

  // ندور هل الـ Category موجودة
  const { data: existing } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) return existing;

  // لو مش موجودة نعملها
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: folderName,
      slug: slug,
    })
    .select()
    .single();

  if (error) throw error;

  console.log(`📁 Created Category: ${folderName}`);

  return data;
}
async function uploadFolder(folderName) {


    const category = await getOrCreateCategory(folderName);

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
        const { data: publicData } = supabase.storage
  .from("products")
  .getPublicUrl(storagePath);

const publicUrl = publicData.publicUrl;

const productName = path.parse(file).name;
// ندور هل المنتج موجود
const { data: existingProduct } = await supabase
  .from("products")
  .select("*")
  .eq("name", productName)
  .maybeSingle();

if (existingProduct) {

  // المنتج موجود → نحدث الصور فقط
  const currentImages = existingProduct.images || [];

  if (!currentImages.includes(publicUrl)) {

    await supabase
      .from("products")
      .update({
        images: [...currentImages, publicUrl]
      })
      .eq("id", existingProduct.id);

    console.log(`📝 Updated Product: ${productName}`);
  }

} else {

  // المنتج مش موجود → نعمله Insert
  const slug = slugify(productName, { lower: true });

  const { error: insertError } = await supabase
    .from("products")
    .insert({
      name: productName,
      slug: slug,
      category_id: category.id,
      price: 7,
      stock: 999,
      rating: 5,
      review_count: 0,
      is_featured: false,
      is_new: true,
      finish_types: ["matte"],
      images: [publicUrl]
    });

  if (insertError) {
    console.log(insertError.message);
  } else {
    console.log(`➕ Added Product: ${productName}`);
  }

}
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