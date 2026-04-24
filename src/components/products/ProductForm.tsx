import React, { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";



import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useCategoryList } from "../../hooks/useCategories";
import { useCreateProduct, useDeleteProductImage, useUpdateProduct, useUploadProductImage } from "../../hooks/useProduct";
import { Spinner } from "../ui/spinner";
import type { IProduct, IProductImage } from "../../types/product";
import { Trash2, Upload } from "lucide-react";
import { cn } from "../../lib/utils";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  categoryId: z
    .union([z.undefined(), z.number().min(1, "Category is required")])
    .refine((value) => value !== undefined, {
      message: "Category is required",
    }),
  qty: z.number().int().min(0, "Quantity must be 0 or more"),
});

export type ProductSchema = z.infer<typeof productSchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product?: IProduct;
}

const ProductForm = ({ open, setOpen, product }: Props) => {

// file upload ============================================

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
      {}
    );

    const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

    
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each file
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 300);
    });
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
    setFileProgresses((prev) => {
      const newProgresses = { ...prev };
      delete newProgresses[filename];
      return newProgresses;
    });
  };

  // file upload ============================================

  const [isLoading, setIsLoading] = useState(false);

  const { data } = useCategoryList();
  const { mutate: createProductMutate } = useCreateProduct();
  const { mutate: updateProductMutate } = useUpdateProduct();
  const { mutate: uploadProductImageMutate } = useUploadProductImage();
  const { mutate: deleteProductImageMutate } = useDeleteProductImage();
  // const { mutate: deleteProductMutate } = useDeleteProduct();

  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ? Number(product?.price) : 0,
      categoryId: product?.categoryId ?? 0,
      qty: product?.qty ?? 0,
    },

    validators: {
      onSubmit: productSchema,
    },

    onSubmit: async ({ value }) => {
      console.log("value", value);

      setIsLoading(true);

      if (product) {
        updateProductMutate(
          { id: product.id, request: value },
          {
            onSuccess: (res) => {
              if(res.data?.id){
                uploadedFiles.forEach((file) => {
                  uploadProductImageMutate({id: res.data.id, request: file})
                })
              }
              console.log("deleteImageIds", deleteImageIds);
              deleteImageIds.map((imageId) => {
                deleteProductImageMutate({id: imageId})
              })
              setOpen(false);
              setUploadedFiles([]);
              form.reset();
            },

            onSettled: () => {
              setIsLoading(false);
            },
          }
        );
      } else {
        createProductMutate(value, {
          onSuccess: (res) => {
            console.log("created product res", res)
            if(res.data.id){
              // uploadProductImageMutate({id: res.data.id, request: uploadedFiles[0]})
              uploadedFiles.forEach((file) => {
                uploadProductImageMutate({id: res.data.id, request: file})
              })
            }
            setOpen(false);
            form.reset();
          },

          onSettled: () => {
            setIsLoading(false);
          },
        });
      }
    },
  });

  useEffect(() => {
    if (product) {
      form.setFieldValue("name", product.name);
      form.setFieldValue("price", Number(product.price));
      form.setFieldValue("categoryId", product.categoryId);
      form.setFieldValue("qty", product.qty);
    } else {
      form.reset();
    }
  }, [product]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent key={product?.id ?? "create"} className="sm:max-w-[70vw] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit" : "Create"} Product </DialogTitle>
          <DialogDescription>Product Information Detail</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}

        <form
        key={product?.id ?? "create"}
          id="product-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Product Name */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter product name"
                      autoComplete="off"
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

              <div className="grid grid-cols-2 gap-5">



            {/* Price */}
            <form.Field
              name="price"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>

                    <Input
                      type="number"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber)
                      }
                      aria-invalid={isInvalid}
                      placeholder="Enter product price"
                      autoComplete="off"
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Quantity */}
            <form.Field
              name="qty"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>

                    <Input
                      type="number"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber)
                      }
                      aria-invalid={isInvalid}
                      placeholder="Enter product qty"
                      autoComplete="off"
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
              </div>
            {/* Category Select */}
            <form.Field
              name="categoryId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel>Category</FieldLabel>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>

                    <Select
                      name={field.name}
                      value={String(field.state.value)}
                      onValueChange={(val) => field.handleChange(Number(val))}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent position="item-aligned">
                        {data?.data?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />

              {/* // upload */}
          <div className="px-6">
            <div
              className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
              onClick={handleBoxClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="mb-2 bg-muted rounded-full p-3">

                {/* // for update */}
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-pretty text-sm font-medium text-foreground">
                Upload a project image
              </p>
              <p className="text-pretty text-sm text-muted-foreground mt-1">
                or,{" "}
                <label
                  htmlFor="fileUpload"
                  className="text-primary hover:text-primary/90 font-medium cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  click to browse
                </label>{" "}
                (4MB max)
              </p>
              <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          </div>

              {/* EDIT PRODUCT IMAGE */}
              {product?.productImages && product.productImages?.length > 0 && (
                <div className="space-y-5">
                  {product.productImages
                  .filter((image: IProductImage) => !deleteImageIds.includes(image.id))
                  .map(
                    (image: IProductImage, index: number) => (
                      <div key={index} className="border border-border rounded-lg p-2 flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                            <img
                              src={image.imageUrl}
                              alt={image.fileName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                                              <div className="flex-1 pr-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground truncate max-w-[250px]">
                            {image.fileName}
                          </span>
                    
                        </div>
                        <Button
                        type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="bg-transparent! hover:text-red-500"
                          onClick={() => {
                            setDeleteImageIds((prev) => [...prev, image.id]);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${fileProgresses[image.fileName] || 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {Math.round(fileProgresses[image.fileName] || 0)}%
                        </span>
                      </div>
                    </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

          <div
            className={cn(
              "px-6 pb-5 space-y-3",
              uploadedFiles.length > 0 ? "mt-4" : ""
            )}
          >
            {uploadedFiles.map((file, index) => {
              const imageUrl = URL.createObjectURL(file);

              return (
                <div
                  className="border border-border rounded-lg p-2 flex flex-col"
                  key={file.name + index}
                  onLoad={() => {
                    return () => URL.revokeObjectURL(imageUrl);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 pr-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground truncate max-w-[250px]">
                            {file.name}
                          </span>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {Math.round(file.size / 1024)} KB
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="bg-transparent! hover:text-red-500"
                          onClick={() => removeFile(file.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${fileProgresses[file.name] || 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {Math.round(fileProgresses[file.name] || 0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          
            
          </FieldGroup>
        </form>

        <DialogFooter>
          <Field orientation="horizontal" className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              className="bg-blue-500"
              type="submit"
              form="product-form"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
