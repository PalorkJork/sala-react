import React from "react";
import { Link } from "react-router-dom";
import CountNumber from "../components/CountNumber";
import CategoryForm from "../components/categories/CategoryForm";

const Home = () => {
  return (
    <>
      <div className="flex gap-5">
        <Link to={"/"}>Home</Link>
        <Link to={"/admin/products"}>Product</Link>
        <Link to={"/admin/category"}>Category</Link>
        <Link to={"/login"}>Login</Link>
      </div>
      <CountNumber></CountNumber>
      <CategoryForm></CategoryForm>
    </>
  );
};

export default Home;
