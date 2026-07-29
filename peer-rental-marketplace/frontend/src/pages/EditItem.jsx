import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ItemForm from "../components/ItemForm";
import Loader from "../components/Loader";

import { getCategories } from "../services/category.service";
import {
  getItemById,
  updateItem,
} from "../services/item.service";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [deposit, setDeposit] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Page loading
  const [pageLoading, setPageLoading] = useState(true);

  // Form submission loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, itemRes] = await Promise.all([
        getCategories(),
        getItemById(id),
      ]);

      setCategories(categoriesRes.data);

      const item = itemRes.data;

      setTitle(item.title);
      setDescription(item.description);
      setDailyRate(item.dailyRate);
      setDeposit(item.deposit);
      setCategoryId(item.category.id);

      // Show existing Cloudinary image
      setPreview(item.imageUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to load item.");
    } finally {
      setPageLoading(false);
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

      await updateItem(id, formData);

      alert("Item updated successfully!");

      navigate("/my-items");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to update item."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Loader text="Loading item..." />;
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">
        Edit Item
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
        submitText="Update Item"
      />
    </>
  );
}