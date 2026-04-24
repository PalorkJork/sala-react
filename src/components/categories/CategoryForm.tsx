import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
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
  useCreateCategory,
  useUpdateCategory,
} from "../../hooks/useCategories";
import type { ICategory } from "../../types/category";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  category?: ICategory;
}

export type CategorySchema = z.infer<typeof categorySchema>;

export const CategoryForm = ({ open, setOpen, category }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createCategoryMutate } = useCreateCategory();
  const { mutate: updateCategoryMutate } = useUpdateCategory();

  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
    },

    validators: {
      onSubmit: categorySchema,
    },

    onSubmit: async ({ value }) => {
      console.log("Category value:", value);

      setIsLoading(true);

      if (category) {
        updateCategoryMutate(
          { id: category.id, request: value },
          {
            onSuccess: () => {
              toast.success("Category updated successfully.");
              setOpen(false);
              form.reset();
            },
            onSettled: () => {
              setIsLoading(false);
            },
          }
        );
      } else {
        createCategoryMutate(value, {
          onSuccess: () => {
            toast.success("Category created successfully.");
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
    if (category) {
      form.reset({
        name: category.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [category]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{category ? "Edit" : "Create"} Form</DialogTitle>
          <DialogDescription>Category Information Detail</DialogDescription>
        </DialogHeader>

        <form
          id="category-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Enter category name
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter category name"
                      autoComplete="off"
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
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
              form="category-form"
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

export default CategoryForm;
