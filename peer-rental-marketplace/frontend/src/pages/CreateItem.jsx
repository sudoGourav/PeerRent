import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getCategories } from "../services/category.service";
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

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const res = await getCategories();

        if (!mounted) return;

        setCategories(
          Array.isArray(res?.data) ? res.data : []
        );
      } catch (err) {
        console.error(
          "Failed to load categories:",
          err
        );

        if (mounted) {
          toast.error(
            err.response?.data?.message ||
              "Failed to load categories."
          );
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;

      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(file);
    setPreview(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const trimmedTitle = title.trim();
    const trimmedDescription =
      description.trim();

    if (
      !trimmedTitle ||
      !trimmedDescription ||
      !dailyRate ||
      !deposit ||
      !categoryId
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    if (
      Number(dailyRate) <= 0 ||
      Number(deposit) < 0
    ) {
      toast.error(
        "Please enter valid prices."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", trimmedTitle);
      formData.append(
        "description",
        trimmedDescription
      );
      formData.append("dailyRate", dailyRate);
      formData.append("deposit", deposit);
      formData.append("categoryId", categoryId);

      if (image) {
        formData.append("image", image);
      }

      await createItem(formData);

      toast.success(
        "Item created successfully!"
      );

      navigate("/my-items", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Failed to create item:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to create item."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
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