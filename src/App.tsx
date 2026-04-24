import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import User from "./pages/User";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Category from "./pages/Category";
import { Toaster } from "./components/ui/sonner";
import PosPage from "./pages/PosPage";

const queryClient = new QueryClient();

function App() {
  const user = {
    firstName: "Ratana",
    lastName: "San",
    gender: "Female",
  };

  const products = [
    {
      id: 1,
      productName: "T-shirt 1",
      productPrice: 99,
      qty: 10,
      imageUrl:
        "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
    },
    {
      id: 2,
      productName: "T-shirt 2",
      productPrice: 99,
      qty: 10,
      imageUrl:
        "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
    },
    {
      id: 3,
      productName: "T-shirt 3",
      productPrice: 99,
      qty: 10,
      imageUrl:
        "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* === MainLayout === */}
          <Route element={<MainLayout></MainLayout>}>
            <Route path="/" element={<Home></Home>}></Route>

            <Route path="/login" element={<Login></Login>}></Route>
          </Route>
          {/* === DashboardLayout === */}
          <Route element={<DashboardLayout></DashboardLayout>}>
            <Route path="/admin/products" element={<Product></Product>}></Route>
            <Route path="/admin/users" element={<User></User>}></Route>
            <Route path="/admin/category" element={<Category></Category>}></Route>
            <Route path="/admin/pos" element={<PosPage></PosPage>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
