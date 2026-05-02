"use client";
import { useState, useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TextField } from "@mui/material";
import style from "./page.module.css";

const Product = () => {
  const router = useRouter();
  const [File, setFile] = useState(null);
  const [checkk, setcheckk] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    try {
      let key = localStorage.getItem("Manager");
      if (key) {
        toast.success("Welcome");
        setcheckk(true);
      } else {
        toast.error("Don't have access to this apge");
        setTimeout(() => {
          router.replace("/manager/login");
        }, 600);
      }
    } catch (error) {
      console.log(error);
    }
  }, [router]);

  // useEffect(() => {
  //   let is = localStorage.getItem("Manager");
  //   if (!is) {
  //     toast.error("Need Secret Code");
  //     router.push("/areyoumanager");
  //   }
  // }, [router]);

  const handleFile = (e) => {
    const fileList = e?.target?.files;
    if (fileList && fileList.length > 0) {
      setFile(fileList[0]);
    } else {
      console.warn("No file selected");
    }
  };

  const submit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("category", data.category);
      if (File) {
        formData.append("image", File);
      }
      console.log(File);
      const res = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });
      const responseData = await res.json();
      if (responseData.success) {
        toast.success("Product added successfully");
      } else {
        toast.error(responseData.message || "Failed to add product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (!checkk) return null;
  return (
    <div>
      <form className={style.form} onSubmit={handleSubmit(submit)}>
        <TextField
          label="Product Name"
          variant="filled"
          InputProps={{
            style: { border: "0.5px solid white", color: "black" },
          }}
          InputLabelProps={{
            style: { color: "gray" },
          }}
          {...register("name", {
            required: { value: true, message: "Needs to fill" },
            minLength: { value: 3, message: "min Length is 3" },
            
          })}
        />
        {errors.name && <div>{errors.name.message}</div>}
        <br />

        <TextField
          label="Product price"
          variant="filled"
          InputProps={{
            style: { border: "0.5px solid white", color: "black" },
          }}
          InputLabelProps={{
            style: { color: "gray" },
          }}
          {...register("price", {
            required: { value: true, message: "Needs to fill" },
          })}
        />
        {errors.price && <div>{errors.price.message}</div>}
        <br />

        <TextField
          label="Product Description"
          variant="filled"
          InputProps={{
            style: { border: "0.5px solid white", color: "black" },
          }}
          InputLabelProps={{
            style: { color: "gray" },
          }}
          {...register("description", {
            required: { value: true, message: "Needs to fill" },
            minLength: { value: 3, message: "min Length is 3" },
          })}
        />
        {errors.description && <div>{errors.description.message}</div>}
        <br />

        <TextField
          label="Product Category"
          variant="filled"
          InputProps={{
            style: { border: "0.5px solid white", color: "black" },
          }}
          InputLabelProps={{
            style: { color: "gray" },
          }}
          {...register("category", {
            required: { value: true, message: "Needs to fill" },
            minLength: { value: 3, message: "min Length is 3" },
            maxLength: { value: 8, message: "Max length is 8" },
          })}
        />
        {errors.category && <div>{errors.category.message}</div>}
        <br />

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ color: "white" }}
        />
        {File && <p style={{ color: "gray" }}>Selected file: {File.name}</p>}
        <br />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default Product;
