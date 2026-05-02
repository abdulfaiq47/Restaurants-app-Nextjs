"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "react-toastify";
import style from "./page.module.css";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const [scann, setScann] = useState(false);
  const [popup, setpopup] = useState(false);
  const [loading, setLoading] = useState(false);
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
      setProductPopup(true);
      setproloading(true);

      const fetc = await fetch("/api/getproduct");
      const res = await fetc.json();

      setproducts(res.product);
    } catch (error) {
      console.error(error);
    } finally {
      setproloading(false);
    }
  }

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroText}>
          <span className={style.badge}>Ultra animated restaurant control</span>
          <h1 className={style.heroTitle}>Welcome to the next-level restaurant app</h1>
          <p className={style.heroSubtitle}>
            Instant table notifications, QR scanning, and menu ordering — all wrapped in a vivid animated UI.
          </p>
          <div className={style.actions}>
            <button className={style.glowButton} onClick={() => setScann(true)}>
              Start scanning
            </button>
            <button className={style.secondaryButton} onClick={handlePro}>
              Browse menu
            </button>
          </div>
        </div>

        <div className={style.heroBubble}>
          <div className={style.pulseCircle}></div>
          <div className={style.scanPanel}>
            <h2>Quick scan</h2>
            <p>Tap to unlock table actions with animated speed.</p>
            <button className={style.signalButton} onClick={() => setScann((v) => !v)}>
              {scann ? "Stop" : "Launch"}
            </button>
          </div>
        </div>
      </div>

      <section className={style.cardGrid}>
        <article className={style.card}>
          <h3>Instant notify</h3>
          <p>Use the QR scanner or table code to alert staff instantly.</p>
          <div className={style.cardStatus}>
            <span className={style.tag}>Live</span>
            <span>Zero friction</span>
          </div>
        </article>

        <article className={style.card + " " + style.glassCard}>
          <h3>Beautiful interface</h3>
          <p>Animated glass panels, neon highlights, and a premium feel across the app.</p>
          <div className={style.cardStatus}>
            <span className={style.tag}>Design</span>
            <span>Fluid motion</span>
          </div>
        </article>

        <article className={style.card}>
          <h3>Order faster</h3>
          <p>Request a waiter, bill, or food with a single click.</p>
          <div className={style.cardStatus}>
            <span className={style.tag}>Speed</span>
            <span>Smart</span>
          </div>
        </article>
      </section>

      <section className={style.formSection}>
        <div className={style.formCard}>
          <h2>Scan or enter a table</h2>
          <p>Send a request in seconds. Example codes: AB01, AC02, AD03, AE04.</p>
          <form onSubmit={FormHandle} className={style.formRow}>
            <input
              className={style.textInput}
              type="text"
              placeholder="Enter the Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
            <button className={style.submitButton} type="submit" disabled={loading}>
              {loading ? "Sending..." : "Notify admin"}
            </button>
          </form>
        </div>

        <div className={style.scannerCard}>
          <h3>QR scanner</h3>
          <p>Tap launch and place your phone over the table QR code.</p>
          {scann && (
            <div className={style.scannerWrap}>
              <Scanner
                onScan={(results) => {
                  if (results && results[0] && !isProcessing) {
                    const value = results[0].rawValue;
                    if (value) {
                      setIsProcessing(true);
                      setTableNumber(value);
                      setScann(false);
                      setpopup(true);
                      handleClick(value);
                      setTimeout(() => setIsProcessing(false), 3000);
                    }
                  }
                }}
                onError={(error) => {
                  toast.error(`Error scanning: ${error.message}`);
                  console.error(error);
                }}
              />
            </div>
          )}
          {!scann && <p className={style.scannerHint}>Press Launch to open the scanner.</p>}
        </div>
      </section>

      {popup && (
        <>
          <div className={style.opca}></div>
          <div className={style.popup}>
            <button className={style.closeButton} onClick={() => { setpopup(false); setProductPopup(false); }}>
              ×
            </button>
            <div className={style.optionCard}>
              <h4>Want Bill?</h4>
              <Image
                className={style.optionImage}
                style={{ cursor: "pointer" }}
                onClick={() => handleClick("Want Bill")}
                src="/Bill.jpeg"
                height={100}
                width={100}
                alt="Bill"
              />
            </div>
            <div className={style.optionCard}>
              <h4>Want Waiter?</h4>
              <Image
                className={style.optionImage}
                style={{ cursor: "pointer" }}
                onClick={() => handleClick("Want Waiter")}
                src="/waiter.jpeg"
                height={100}
                width={100}
                alt="waiter"
              />
            </div>
            <div className={style.optionCard} onClick={handlePro}>
              <h4>Want Something?</h4>
              <Image
                className={style.optionImage}
                style={{ cursor: "pointer" }}
                src="/produc.png"
                height={100}
                width={100}
                alt="products"
              />
            </div>
          </div>
        </>
      )}

      {productPopup && (
        <ul className={style.product}>
          <button className={style.closeButton} onClick={() => setProductPopup(false)}>
            ×
          </button>
          {proloading ? (
            <div className={style.loaderWrapper}>
              <ClipLoader color={"#70e5ff"} size={50} aria-label="Loading Spinner" data-testid="loader" />
            </div>
          ) : (
            products.map((n, i) => (
              <li className={style.productItem} onClick={() => handleClick(` ${n.category} ${n.name}`)} key={i}>
                <p className={style.productName}>{n.name}</p>
                <Image className={style.productImage} src={n.imageUrl} height={100} width={100} alt={n.name} />
                <p className={style.productPrice}>Rs {n.price}</p>
                <p className={style.productDescription}>{n.description}</p>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
