import React from "react";
import Link from "next/link";
import style from "./page.module.css"

const Navbar = () => {
  return (
    <div className={style.Navbar}  >
      <ul style={{}} >
        
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
