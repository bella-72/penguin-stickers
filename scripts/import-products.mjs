import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs-extra";
import path from "path";
import slugify from "slugify";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRODUCTS_DIR = "./products";

async function main() {

    const folders = await fs.readdir(PRODUCTS_DIR);

    // نجيب الكاتيجوريز مرة واحدة
    const { data: categories } = await supabase
        .from("categories")
        .select("*");

    for (const folder of folders) {

        const folderPath = path.join(PRODUCTS_DIR, folder);

        const stat = await fs.stat(folderPath);

        if (!stat.isDirectory()) continue;

        console.log(`\n📂 ${folder}`);

        const category = categories.find(c =>
            c.name.toLowerCase() === folder.toLowerCase()
        );

        if (!category) {
            console.log(`❌ Category "${folder}" not found`);
            continue;
        }

        const files = await fs.readdir(folderPath);

        for (const file of files) {

            if (!file.match(/\.(png|jpg|jpeg|webp)$/i))
                continue;

            const name = path.parse(file).name;

            const slug = slugify(name, {
                lower: true,
                strict: true
            });

            const imageUrl =
`${process.env.SUPABASE_URL}/storage/v1/object/public/products/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;

            // لو موجود قبل كده سيبه
            const { data: exists } = await supabase
                .from("products")
                .select("id")
                .eq("slug", slug)
                .maybeSingle();

            if (exists) {
                console.log(`⏭ ${name}`);
                continue;
            }

            const { error } = await supabase
                .from("products")
                .insert({

                    name,

                    slug,

                    description: "",

                    price: 7,

                    original_price: null,

                    category_id: category.id,

                    images: [imageUrl],

                    finish_types: ["matte"],

                    stock: 999,

                    rating: 5,

                    review_count: 0,

                    is_featured: false,

                    is_new: true

                });

            if (error) {

                console.log(`❌ ${name}`);

                console.log(error.message);

            } else {

                console.log(`✅ ${name}`);

            }

        }

    }

}

main();