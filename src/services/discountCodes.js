import { supabase } from "@/lib/supabase";

export const discountCodesService = {
  // Get all discount codes
  async getAll() {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  },

  // Create discount code
  async create(codeData) {
    const { data, error } = await supabase
      .from("discount_codes")
      .insert(codeData)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Update discount code
  async update(id, updates) {
    const { data, error } = await supabase
      .from("discount_codes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Delete discount code
  async delete(id) {
    const { error } = await supabase
      .from("discount_codes")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

 
// Find coupon by code
async getByCode(code) {
    console.log("Searching For:", code);
  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", code)
    .eq("active", true)
    .maybeSingle();

  console.log("Coupon Query:", data);
  console.log("Coupon Error:", error);

  if (error) throw error;

  return data;
},
  
};