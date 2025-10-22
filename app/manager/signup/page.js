"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();
  const [succ, setsucc] = useState(false);

  const submit = async (data) => {
    try {
      const fet = await fetch("/api/crmanager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const res = await fet.json();
      if (res.success) {
        toast.success(res.message);
        setsucc(true);
        router.push("/manager/login")
      } else {
        toast.error(res.message);
        setsucc(false);
      }
      console.log(data, res);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      {isSubmitting && <div>Loading...</div>}

      <form onSubmit={handleSubmit(submit)}>
        {/* NAME */}
        <input
          placeholder="Name"
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Minimum length is 2" },
            maxLength: { value: 10, message: "Maximum length is 10" },
          })}
        />
        {errors.name && <p style={{ color: "white" }}>{errors.name.message}</p>}

        <br />

        {/* EMAIL */}
        <input
          placeholder="Email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <p style={{ color: "white" }}>{errors.email.message}</p>
        )}

        <br />

        {/* PASSWORD */}
        <input
          placeholder="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 4, message: "Minimum length is 4" },
          })}
        />
        {errors.password && (
          <p style={{ color: "white" }}>{errors.password.message}</p>
        )}

        <br />

        {/* SECRET */}
        <input
          placeholder="Secret"
          {...register("secret", {
            required: "Secret is required",
            minLength: { value: 2, message: "Minimum length is 2" },
          })}
        />
        {errors.secret && (
          <p style={{ color: "white" }}>{errors.secret.message}</p>
        )}

        <br />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {succ && (
        <p style={{ color: "lightgreen" }}>Form submitted successfully!</p>
      )}
    </>
  );
};

export default Signup;
