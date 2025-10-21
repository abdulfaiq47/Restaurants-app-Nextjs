"use client";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const areyoumanager = () => {
  const router = useRouter();
  const [value, setvalue] = useState("");

  const handlesubmit = (e) => {
    e.preventDefault();

    if (value === "MySeCretkEyis_SecRetCode") {
      toast.success("Redirect To Manager Dashboard");
      localStorage.setItem("Manager", "true")
      router.push("/manager/dashboard");
    } else {
      toast.error("Invaild credentials");
    }
  };

  return (
    <form onSubmit={handlesubmit}>
      <input
        onChange={(e) => setvalue(e.target.value)}
        value={value}
        type="text"
        placeholder="Enter Secret key"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default areyoumanager;
