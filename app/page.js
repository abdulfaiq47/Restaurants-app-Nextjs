"use client";

import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "react-toastify";
import style from "./page.module.css";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const [scann, setScann] = useState(false);
  const [popup, setpopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setnotification] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [productPopup, setProductPopup] = useState(false);
  const [products, setproducts] = useState([]);
  const [proloading, setproloading] = useState(false);

  async function handleClick(e) {
    const tablenum = e;

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
      if (productPopup) {
        setProductPopup(false);
        return;
      }
      setProductPopup(true); // Show popup first
      setproloading(true); // Then show loader inside it

      const fetc = await fetch("/api/getproduct");
      const res = await fetc.json();

      setproducts(res.product);
    } catch (error) {
      console.error(error);
    } finally {
      setproloading(false); // Hide loader after data is loaded
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Weclome To Our Resturents App</h1>

      {scann ? (
        <button
          style={{
            background: "#0070f3",
            color: "white",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setScann(false)}
        >
          Stop Scanning
        </button>
      ) : (
        <button
          style={{
            background: "#0070f3",
            color: "white",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setScann(true)}
        >
          Start Scanning
        </button>
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
                  handleClick(value);
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
      <h2>Or</h2>
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
                color: "transparent",
                cursor: "pointer",
                position: "relative",
                top: "-26px",
                left: "-27px",
                filter: "invert(1)",
              }}
              src="/close.svg"
              height={30}
              width={30}
              alt="close"
            ></Image>

            <div className={style.Bill}>
              <h4>Want Bill?</h4>
              <Image
                style={{ cursor: "pointer" }}
                onClick={() => handleClick("Want Bill")}
                src="/Bill.jpeg"
                height={100}
                width={100}
                alt="Bill"
              ></Image>
            </div>
            <div className={style.waiter}>
              <h4>Want Waiter?</h4>
              <Image
                style={{ cursor: "pointer" }}
                onClick={() => handleClick("Want Waiter")}
                src="/waiter.jpeg"
                height={100}
                width={100}
                alt="waiter"
              ></Image>
            </div>
            <div onClick={handlePro} className={style.products}>
              <h4>Want Somethings?</h4>
              <Image
                style={{ cursor: "pointer" }}
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
          <Image
            onClick={() => {
              setProductPopup(false);
            }}
            style={{
              color: "transparent",
              cursor: "pointer",
              position: "relative",
              top: "-26px",
              left: "-27px",
              filter: "invert(1)",
            }}
            src="/close.svg"
            height={30}
            width={30}
            alt="close"
          ></Image>
          {proloading ? (
            <ClipLoader
              color={"black"}
              // cssOverride={override}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            products.map((n, i) => (
              <li
                onClick={() => handleClick(` ${n.category} ${n.name}`)}
                key={i}
              >
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
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
