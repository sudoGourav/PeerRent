import { useEffect, useState } from "react";
import { getCategories } from "../services/category.service";
import { useNavigate } from "react-router-dom";
import { createItem } from "../services/item.service";

export default function CreateItem() {
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [deposit, setDeposit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !title ||
    !description ||
    !dailyRate ||
    !deposit ||
    !categoryId
  ) {
    alert("Please fill all fields.");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("dailyRate", dailyRate);
    formData.append("deposit", deposit);
    formData.append("categoryId", categoryId);

    if (image) {
      formData.append("image", image);
    }

    await createItem(formData);

    alert("Item created successfully!");

    navigate("/");
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to create item."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-8 text-3xl font-bold">
        List a New Item
      </h1>

      <form
  onSubmit={handleSubmit}
  className="space-y-6"
>
        {/* Image */}
        <div>
          <label className="mb-2 block font-semibold">
            Item Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 h-64 w-full rounded-lg border object-cover"
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block font-semibold">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Canon DSLR Camera"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block font-semibold">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Describe your item..."
          />
        </div>

        {/* Rates */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold">
              Daily Rate
            </label>

            <input
              type="number"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Deposit
            </label>

            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="2000"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-semibold">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
  type="submit"
  disabled={loading}
  className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
>
  {loading ? "Creating..." : "Create Item"}
</button>
      </form>
    </div>
  );
}