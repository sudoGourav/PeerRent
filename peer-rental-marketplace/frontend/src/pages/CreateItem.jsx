import { useEffect, useState } from "react";
import { getCategories } from "../services/category.service";
import { useNavigate } from "react-router-dom";
import { createItem } from "../services/item.service";
import ItemForm from "../components/ItemForm";

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
  <>
    <h1 className="mb-8 text-3xl font-bold">
      List a New Item
    </h1>

    <ItemForm
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      dailyRate={dailyRate}
      setDailyRate={setDailyRate}
      deposit={deposit}
      setDeposit={setDeposit}
      categoryId={categoryId}
      setCategoryId={setCategoryId}
      categories={categories}
      preview={preview}
      handleImageChange={handleImageChange}
      handleSubmit={handleSubmit}
      loading={loading}
      submitText="Create Item"
    />
  </>
);
}