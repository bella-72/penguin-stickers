import {
  Plus,
  Pencil,
  Trash2,
  TicketPercent,
  X,
  RefreshCw
} from "lucide-react";
import { useEffect ,useState } from "react";
import Button from "@/components/ui/Button";
import { discountCodesService } from "@/services/discountCodes";
import toast from "react-hot-toast";
const DiscountCodes = () => {
const [open, setOpen] = useState(false);

const [form, setForm] = useState({
  code: "",
  discount: "",
  active: true,
});
const generateCoupon = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  setForm({
    ...form,
    code,
  });
};
const handleSaveCoupon = async () => {
  try {
    if (!form.code.trim()) {
      return toast.error("Please enter coupon code");
    }

    if (!form.discount) {
      return toast.error("Please enter discount percentage");
    }

if (editingCoupon) {
  await discountCodesService.update(editingCoupon.id, {
    code: form.code.toUpperCase(),
    discount_percent: Number(form.discount),
    active: form.active,
  });

  toast.success("Coupon updated successfully 🎉");

} else {
  await discountCodesService.create({
    code: form.code.toUpperCase(),
    discount_percent: Number(form.discount),
    active: form.active,
  });

  toast.success("Coupon created successfully 🎉");
}

await fetchCoupons();

setOpen(false);

setEditingCoupon(null);

setForm({
  code: "",
  discount: "",
  active: true,
});

  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};
const [coupons, setCoupons] = useState([]);
const [loading, setLoading] = useState(true);
const fetchCoupons = async () => {
  try {
    setLoading(true);

    const data = await discountCodesService.getAll();

    setCoupons(data);

  } catch (error) {
    console.error(error);
    toast.error("Failed to load coupons");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchCoupons();
}, []);
const handleDeleteCoupon = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this coupon?"
  );

  if (!confirmed) return;

  try {
    await discountCodesService.delete(id);

    toast.success("Coupon deleted successfully");

    fetchCoupons();
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

const handleEditCoupon = (coupon) => {
  setEditingCoupon(coupon);

  setForm({
    code: coupon.code,
    discount: coupon.discount_percent,
    active: coupon.active,
  });

  setOpen(true);
};
const [editingCoupon, setEditingCoupon] = useState(null);
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Discount Codes
          </h1>
          <p className="text-gray-400 mt-2">
            Create and manage discount coupons.
          </p>
        </div>

        <Button
  iconLeft={Plus}
  className="px-6 py-3 rounded-xl"
  onClick={() => {
  setEditingCoupon(null);

  setForm({
    code: "",
    discount: "",
    active: true,
  });

  setOpen(true);
}}
>
  Create Coupon
</Button>
      </div>

      {/* Table */}
      <div className="bg-[#181826] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#202033] border-b border-white/5">
            <tr className="text-left text-gray-300 text-sm uppercase tracking-wide">
              <th className="p-4">Coupon</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Used</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

         <tbody>

{loading ? (

<tr>
<td colSpan={6} className="text-center p-8">
Loading...
</td>
</tr>

) : coupons.length === 0 ? (

<tr>
<td colSpan={6}>
<div className="flex flex-col items-center justify-center py-16">

<TicketPercent
size={55}
className="text-brand-primary mb-4"
/>

<h2 className="text-xl font-semibold">
No Discount Codes Yet
</h2>

<p className="text-brand-gray-500 mt-2">
Create your first coupon to start offering discounts.
</p>

</div>
</td>
</tr>

) : (

coupons.map((coupon) => (

<tr
key={coupon.id}
className="border-t border-brand-gray-700"
>

<td className="p-4 font-semibold">
{coupon.code}
</td>

<td className="p-4">
{coupon.discount_percent}%
</td>

<td className="p-4">
{coupon.used_count || 0}
</td>

<td className="p-4">

<span
className={`px-3 py-1 rounded-full text-xs font-medium ${
coupon.active
? "bg-green-500/20 text-green-400"
: "bg-red-500/20 text-red-400"
}`}
>

{coupon.active ? "Active" : "Inactive"}

</span>

</td>

<td className="p-4">
{new Date(coupon.created_at).toLocaleDateString()}
</td>

<td className="p-4">

<div className="flex justify-center gap-3">

<button
  onClick={() => handleEditCoupon(coupon)}
  className="text-blue-400 hover:text-blue-300"
>
  <Pencil size={18} />
</button>

<button
  onClick={() => handleDeleteCoupon(coupon.id)}
  className="text-red-400 hover:text-red-300"
>
  <Trash2 size={18} />
</button>

</div>

</td>

</tr>

))

)}

</tbody>
        </table>
      </div>
      {open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

    <div className="w-full max-w-lg rounded-2xl bg-[#181826] border border-white/10 p-6">

      <div className="flex items-center justify-between mb-6">

       <h2 className="text-2xl font-bold text-white">
  {editingCoupon ? "Edit Coupon" : "Create Coupon"}
</h2>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <X />
        </button>

      </div>

      <div className="space-y-5">

        <div>

          <label className="text-sm text-gray-300">
            Coupon Code
          </label>

          <div className="flex gap-2 mt-2">

            <input
              value={form.code}
              onChange={(e)=>
                setForm({...form,code:e.target.value.toUpperCase()})
              }
              className="flex-1 bg-[#202033] border border-white/10 rounded-xl px-4 py-3 text-white"
              placeholder="SUMMER25"
            />

          <button
  type="button"
  onClick={generateCoupon}
  className="px-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white transition"
>
  <RefreshCw size={18}/>
</button>

          </div>

        </div>

        <div>

          <label className="text-sm text-gray-300">
            Discount %
          </label>

          <input
            type="number"
            value={form.discount}
            onChange={(e)=>
              setForm({...form,discount:e.target.value})
            }
            className="w-full mt-2 bg-[#202033] border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="20"
          />

        </div>

        <label className="flex items-center gap-3 text-gray-300">

          <input
            type="checkbox"
            checked={form.active}
            onChange={(e)=>
              setForm({...form,active:e.target.checked})
            }
          />

          Active

        </label>

     <Button
  className="w-full"
  onClick={handleSaveCoupon}
>
  {editingCoupon ? "Update Coupon" : "Save Coupon"}
</Button>
      </div>

    </div>

  </div>
)}
    </div>
  );
};

export default DiscountCodes;