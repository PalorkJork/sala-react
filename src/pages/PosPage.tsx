"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {

  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,

  QrCode,
  Minus,
} from "lucide-react";
import { useProducts } from "../hooks/useProduct";
import type { IProduct } from "../types/product";
import { useCategories } from "../hooks/useCategories";
import type { ICategory } from "../types/category";
import { toast } from "sonner";
import type { ICart } from "../types/cart";
import SharedDialog from "../components/SharedDialog";

import { useCreateOrder } from "../hooks/useOrder";
import type { OrderPayload } from "../services/order.services";
import { Input } from "../components/ui/input";
import { Loading } from "../components/Loading";
import { useCheckTransaction, useCreatePayment } from "../hooks/usePayment";
import { useSearchParams } from "react-router-dom";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Duck Salad",
    category: "Pizza",
    price: 35.0,
    image: "/product1.png",
  },
  {
    id: "2",
    name: "Breakfast board",
    category: "Taco",
    price: 14.0,
    image: "/product1.png",
  },
  {
    id: "3",
    name: "Hummus",
    category: "Sandwich",
    price: 24.0,
    image: "/product1.png",
  },
  {
    id: "4",
    name: "Roast beef",
    category: "Kebab",
    price: 17.5,
    image: "/product1.png",
  },
  {
    id: "5",
    name: "Tuna salad",
    category: "Popcorn",
    price: 35.0,
    image: "/product1.png",
  },
  {
    id: "6",
    name: "Salmon",
    category: "Burger",
    price: 48.0,
    image: "/product1.png",
  },
  {
    id: "7",
    name: "California roll",
    category: "Taco",
    price: 74.0,
    image: "/product1.png",
  },
  {
    id: "8",
    name: "Sashimi",
    category: "Burrito",
    price: 74.0,
    image: "/product1.png",
  },
];

export default function PosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [cartItems, setCartItems] = useState<ICart[]>([]);
  const [draftNumber, setDraftNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const { data: productData } = useProducts(searchText, 1, 10, selectedCategory);
  const { data: categoryData } = useCategories();

  const { mutate: checkTransactionMutate } = useCheckTransaction();

  const [isLoading, setIsLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

useEffect(() => {
    const tranId = searchParams.get("tranId");
    if (tranId) {
      checkTransactionMutate(tranId, {
        onSuccess: () => {
          setSearchParams({});
        },
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);
   useEffect(() => {
    const timer = setTimeout(() => {}, 5000); // delay 5 sec

    return () => clearTimeout(timer);
  }, [searchText]);

  const categories = (categoryData?.data as ICategory[]) ?? [];
  const products = (productData?.data as IProduct[]) ?? [];
  console.log("productData: ", products);

  const allCategories = [
    {
      id: undefined,
      name: "ALL",
    },
    ...categories,
  ]

  const addToOrder = (product: IProduct) => {
    if (product.qty <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      // If already exists → increase qty
      if (existingItem) {
        if (existingItem.qty >= existingItem.stock) {
          toast.warning("Product is out of stock");
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      // If new item → add
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category?.name || "Uncategorized",
          price: Number(product.price),
          imageUrl: product.productImages?.[0]?.imageUrl || "/no-image.png",
          stock: product.qty,
          qty: 1, // ✅ use qty (NOT quantity)
        },
      ];
    });
  };

  const removeFromOrder = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
     setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id !== id) return item;

          const newQty = Math.min(qty, item.stock);

          if (newQty === 0) return null;
            return { ...item, qty: newQty };
        })
        .filter(Boolean) as ICart[];
    });
      
 
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const total = subtotal;

  const { mutate: createOrderMutate } = useCreateOrder();
  const { mutate: createPaymentMutate } = useCreatePayment();

  const handleCheckout = () => {
    setIsLoading(true);

    const payload: OrderPayload = {
      discount: 0,
      items: cartItems.map((item) => ({
        productId: item.id,
        qty: item.qty,
      })),
    };
    createOrderMutate(payload, {
  onSuccess: (res) => {
        console.log("Res", res);
        const orderId = res.data.id;
        createPaymentMutate(orderId, {
          onSuccess: (res) => {
            if (res.data) {
              const payway = res.data.payway;

              const form = document.createElement("form");
              form.id = "aba_merchant_request";
              form.method = payway.method;
              form.action = payway.action;
              form.target = payway.target;
              Object.entries(payway.fields).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
              });

              document.body.appendChild(form);

              setIsOpen(false);
              AbaPayway?.checkout();
            }
          },
        });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };


  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Categories</h1>
              <div className="flex items-center gap-2">
                <ChevronLeft className="text-muted-foreground h-5 w-5" />
                <ChevronRight className="text-muted-foreground h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border-b p-4">
            <div className="flex gap-4 overflow-x-auto">
              {allCategories.map((item: ICategory) => (
                <div
                  key={item.id}
                  className="hover:bg-muted flex min-w-[80px] cursor-pointer flex-col items-center rounded-lg p-2"
                  onClick={() => setSelectedCategory(item.id)}
                >
                  <span className="text-muted-foreground text-center text-xs">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        
    
              
        

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-auto p-6">
              {/* Input Box */}
                <Input
              placeholder="Search product name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full mb-6 "
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.map((item: IProduct) => (
                <Card
                  onClick={() => addToOrder(item)}
                  key={item.id}
                  className="cursor-pointer transition-shadow hover:shadow-lg p-0"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={
                          item.productImages?.[0]?.imageUrl || "/no-image.png"
                        }
                        alt={item.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground mb-2 text-sm">
                        {item.category.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-600">
                          ${item.price}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Stock: {item.qty}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Order Summary */}
        <div className="flex w-80 flex-col border-l">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">
                Draft #{draftNumber.toString().padStart(3, "0")}
              </h2>
              <div className="flex items-center gap-2">
                <Plus className=" h-4 w-4 text-green-500" />
                <Trash2
                  className=" h-4 w-4 text-red-500"
                  onClick={() => setCartItems([])}
                />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {cartItems.map((item: ICart, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10">
                    <img src={item.imageUrl} alt={item.name} className="" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm">{item.name}</h4>
                    <p className="text-muted-foreground text-xs">
                      {item.category}
                    </p>
                    <p className=" text-xs text-red-500">${item.price}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-sm">
                      ${item.price * item.qty}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        className="w-7 h-7"
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                      >
                        <Minus />
                      </Button>

                      <span className="w-6 text-center text-sm font-medium">
                        {item.qty}
                      </span>

                      <Button
                        className="w-7 h-7"
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                      >
                        <Plus />
                      </Button>

                      <Button
                        className="w-7 h-7 bg-red-500"
                        onClick={() => removeFromOrder(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="mb-4 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 p-3 hover:shadow-sm"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <span className="font-semibold text-green-600">$</span>
                </div>
                <span className="text-xs">Cash</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 p-3 hover:shadow-sm"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                  <QrCode className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs">Scan</span>
              </Button>
            </div>

            <Button
              onClick={() => setIsOpen(true)}
              className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700"
            >
              Checkout ${total.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
      <SharedDialog open={isOpen} setOpen={setIsOpen} isCancel={false}>
        <div className="space-y-3">
          {cartItems.map((item: ICart, index: number) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10">
                <img src={item.imageUrl} alt={item.name} className="" />
              </div>

              <div className="flex-1">
                <h4 className="text-sm">{item.name}</h4>
                <p className="text-muted-foreground text-xs">{item.category}</p>
                <p className=" text-xs text-red-500">${item.price}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold text-sm">
                  ${item.price * item.qty}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  Quantity:
                  <span className="w-6 text-center text-sm font-medium">
                    {item.qty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-end mt-5">
          <p className="font-semibold text-primary">
            Total: ${total.toFixed(2)}
          </p>
        </div>
        <Button onClick={handleCheckout} type="button" className="w-full mt-5">
          {" "}
          Checkout
        </Button>
      </SharedDialog>
      <SharedDialog
        open={isSuccess}
        setOpen={setIsSuccess}
        isCancel={false}
        title="Order Created"
        desc="Order created successfully"
        width="40%"
      >
        <div className="flex flex-col items-center justify-center">
          <img className="w-[300px]" src="/tick.png" alt="" />
          <p className="text-green-500 mt-5">Order created successfully</p>
        </div>
      </SharedDialog>
    </div>
  );
}
