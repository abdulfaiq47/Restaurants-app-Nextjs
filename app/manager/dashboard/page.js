"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [allData, setAllData] = useState([]);
  const prevCount = useRef(0); // to track previous notifications
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkk, setcheckk] = useState(false);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/getnotify");
        const json = await res.json();

        if (json.success && Array.isArray(json.notifications)) {
          // ✅ Check if new notification came
          if (json.notifications.length > prevCount.current) {
            const newNoti =
              json.notifications[0]?.notification || "New Notification!";
            toast.info(`🔔 ${newNoti}`);
          }

          // update data and count
          prevCount.current = json.notifications.length;
          setAllData(json.notifications);
        } else {
          console.error("Invalid data format", json);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 7000);

    // cleanup on unmount
    return () => clearInterval(interval);
  }, [checked]);
  const deluser = async (id) => {
    const fetc = await fetch("/api/delnoti", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }), // ✅ Send ID to backend
    });

    const res = await fetc.json();
    if (res.success) {
      toast.success("Deleted");
      setAllData((prevData) => prevData.filter((u) => u._id !== id));
    } else {
      toast.error("Failed to delete notification");
    }
  };

  if (!checkk) return null;

  return (
    <div style={{ padding: 20 }}>
      <h2> Notifications: </h2>
      {loading ? (
        "Loading..."
      ) : allData.length === 0 ? (
        <p>No notifications yet...</p>
      ) : (
        <ul>
          {allData.map((n, i) => (
            <li key={i}>
              {n.notification} — <small>{n.time}</small>
              <button onClick={() => deluser(n._id)}>delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
