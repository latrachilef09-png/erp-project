"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
});

type CategoryFormInput = z.input<typeof categorySchema>;
type CategoryFormData = z.output<typeof categorySchema>;

export default function CreateCategoryPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormInput, undefined, CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    console.log("FORM DATA:", data);

    try {
      const response = await api.post(
        "/product-categories",
        data
      );

      console.log("CREATED CATEGORY:", response.data);

      router.push("/categories");
    } catch (error) {
      console.log("CREATE CATEGORY ERROR:", error);
    }
  };

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">
        Create Category
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <input
          {...register("name")}
          placeholder="Category name"
          className="border p-2 w-full"
        />

        <p className="text-red-500">
          {errors.name?.message}
        </p>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}