"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productsService } from "@/services/products";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  reference: z.string().min(2, "Reference is required"),
  name: z.string().min(2, "Name is required"),
  minStock: z.coerce
    .number()
    .min(0, "Minimum stock cannot be negative"),
  categoryId: z.coerce
    .number()
    .min(1, "Category ID must be at least 1"),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormData = z.output<typeof productSchema>;

export default function CreateProductPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, undefined, ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    console.log("FORM DATA:", data);

    try {
      const result = await productsService.create(data);

      console.log("CREATED PRODUCT:", result);

      router.push("/products");
    } catch (error) {
      console.log("CREATE ERROR:", error);
    }
  };

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">
        Create Product
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Reference */}
        <div>
          <input
            {...register("reference")}
            placeholder="Reference"
            className="border p-2 w-full"
          />

          <p className="text-red-500">
            {errors.reference?.message}
          </p>
        </div>

        {/* Name */}
        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="border p-2 w-full"
          />

          <p className="text-red-500">
            {errors.name?.message}
          </p>
        </div>

        {/* Minimum Stock */}
        <div>
          <input
            type="number"
            min="0"
            {...register("minStock")}
            placeholder="Minimum stock"
            className="border p-2 w-full"
          />

          <p className="text-red-500">
            {errors.minStock?.message}
          </p>
        </div>

        {/* Category ID */}
        <div>
          <input
            type="number"
            min="1"
            {...register("categoryId")}
            placeholder="Category ID"
            className="border p-2 w-full"
          />

          <p className="text-red-500">
            {errors.categoryId?.message}
          </p>
        </div>

        {/* Submit */}
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