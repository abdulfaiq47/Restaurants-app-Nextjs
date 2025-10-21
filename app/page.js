"use client";

import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "react-toastify";
import style from "./page.module.css";
import Image from "next/image";

export default function Home() {
  const [scann, setScann] = useState(false);
  const [popup, setpopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setnotification] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [productPopup, setProductPopup] = useState(false);
  const [products, setproducts] = useState([]);

  async function handleClick(e) {
    const tablenum = e || tableNumber;

    if (!tablenum) {
      return toast.error("Required Table Number");
    }
    setLoading(true);
    // if (!tableNumber) return toast.error("No table number scanned");
    const res = await fetch("/api/crnotify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNumber: tablenum }),
    });
    let json = await res.json();
    if (json.success) {
      toast.success(json.message);
      setpopup(true);
    } else {
      toast.error(json.message || "Failed to create notification");
    }
    setLoading(false);
  }

  async function FormHandle(e) {
    e.preventDefault();
    const tablenum = tableNumber;

    if (!tablenum) {
      return toast.error("Required Table Number");
    }
    if (
      tablenum !== "AB01" &&
      tablenum !== "AC02" &&
      tablenum !== "AD03" &&
      tablenum !== "AE04"
    ) {
      toast.error("You Entered wrong !");
      setpopup(false);
      return null;
    }

    setLoading(true);
    // if (!tableNumber) return toast.error("No table number scanned");
    const res = await fetch("/api/crnotify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNumber: tablenum }),
    });
    let json = await res.json();
    if (json.success) {
      toast.success(json.message);
      setpopup(true);
    } else {
      toast.error(json.message || "Failed to create notification");
    }
    setLoading(false);
  }

  async function handlePro() {
    try {
      let fetc = await fetch("/api/getproduct");
      let res = await fetc.json();
      let product = await res.product;

      setproducts(product);
      productPopup ? setProductPopup(false) : setProductPopup(true);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>QR Code Scanner</h1>
      {scann ? (
        <button onClick={() => setScann(false)}>Stop Scanning</button>
      ) : (
        <button onClick={() => setScann(true)}>Start Scanning</button>
      )}
      {scann === true && (
        <div className={style.scanner}>
          <Scanner
            onScan={(results) => {
              if (results && results[0] && !isProcessing) {
                const value = results[0].rawValue;
                if (value) {
                  console.log(value);
                  setIsProcessing(true);
                  setTableNumber(value);
                  setScann(false);
                  setpopup(true);
                  handleClick();
                  setTimeout(() => setIsProcessing(false), 3000); // unlock after 3s
                }
              }
            }}
            // onScan={(results) => {
            //   if (results && results[0]) {
            //     const value = results[0].rawValue;
            //     if (value && value !== tableNumber) {
            //       setTableNumber(value);

            //       setScann(false);
            //       setpopup(true);
            //       handleClick();
            //     }
            //   }
            // }}
            onError={(error) => {
              toast.error(`Error scanning: ${error.message}`);
              console.error(error);
            }}
          />
        </div>
      )}
      <h2>Scanned Code Data:</h2>
      <p style={{ marginTop: "1rem" }}>{}</p>
      <form onSubmit={FormHandle}>
        <input
          type="text"
          placeholder="Enter the TableNumber"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#0070f3",
            color: "white",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Sending..." : "Notify Admin"}
        </button>
      </form>

      {popup && (
        <>
          <div className={style.opca}></div>
          <div className={style.popup}>
            <Image
              onClick={() => {
                setpopup(false);
                setProductPopup(false);
              }}
              style={{
                cursor: "pointer",
                position: "relative",
                top: "-52px",
                left: "-121px",
              }}
              src="/close.svg"
              height={30}
              width={30}
              alt="close"
            ></Image>

            <div className={style.Bill}>
              <Image
                onClick={() => handleClick("Want Bill")}
                src="/Bill.jpeg"
                height={100}
                width={100}
                alt="Bill"
              ></Image>
            </div>
            <div className={style.waiter}>
              <Image
                onClick={() => handleClick("Want Waiter")}
                src="/waiter.jpeg"
                height={100}
                width={100}
                alt="waiter"
              ></Image>
            </div>
            <div onClick={handlePro} className={style.products}>
              <Image
                src="/produc.png"
                height={100}
                alt="products"
                width={100}
              ></Image>
            </div>
          </div>
        </>
      )}
      {productPopup ? (
        <ul className={style.product}>
          {products.map((n, i) => (
            <li onClick={() => handleClick(` ${n.category} ${n.name}`)} key={i}>
              <p>{n.name}</p>
              <Image
                src={n.imageUrl}
                height={100}
                width={100}
                alt={n.name}
              ></Image>
              <p>RS: {n.price}</p>
              <p>{n.description}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
