"use client";
import { useState, useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const product = () => {
  const router = useRouter();
  const [Check, setCheck] = useState(false);
  const [File, setFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    try {
      let key = localStorage.getItem("Manager");
      if (!key) {
        toast.error("Secret key required — redirecting to secure page.");
        setTimeout(() => {
          router.replace("/areyoumanager");
        }, 600);
      } else {
        setCheck(true);
      }
    } catch (error) {
      toast.error("Authorization check failed — redirecting.");
      router.replace("/");
    }
  }, [router]);
  if (!Check) {
    return null;
  }

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
  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <input
          {...register("name", {
            required: { value: true, message: "Needs to fill" },
            minLength: { value: 3, message: "min Length is 3" },
            maxLength: { value: 8, message: "Max length is 8" },
          })}
          type="text"
          placeholder="Enter Product name"
        />
        {errors.name && <div>{errors.name.message}</div>}
        <br />
        <hr />
        <input
          {...register("price", {
            required: { value: true, message: "Needs to fill" },
          })}
          type="text"
          placeholder="Enter Product price"
        />
        {errors.price && <div>{errors.price.message}</div>}
        <br />
        <hr />
        <textarea
          {...register("description", {
            required: { value: true, message: "Needs to fill" },
            minLength: { value: 3, message: "min Length is 3" },
          })}
        ></textarea>
        {errors.description && <div>{errors.description.message}</div>}
        <br />
        <hr />
        <input
          {...register("category", {
            required: { value: true, message: "Needs to fill" },
            minLength: { value: 3, message: "min Length is 3" },
            maxLength: { value: 8, message: "Max length is 8" },
          })}
          type="text"
          placeholder="Enter Product category"
        />

        {errors.category && <div>{errors.category.message}</div>}
        <br />
        <hr />
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ color: "white" }}
        />
        {File && <p style={{ color: "gray" }}>Selected file: {File.name}</p>}
        <br />
        <hr />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default product;
