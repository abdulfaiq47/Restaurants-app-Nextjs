import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div>
      <ul style={{display: "flex" , gap: "130px"}} >
        
        <Link href={"/"}>
          <li>Home</li>
        </Link>
        <Link href={"/manager/dashboard"}>
          <li>DashBoard</li>
        </Link>
        <Link href={"/manager/product"}>
          <li>Products</li>
        </Link>
      </ul>
    </div>
  );
};

export default Navbar;
