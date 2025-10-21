// "use client";
// import { useEffect, useState } from "react";

// export default function AdminPage() {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const eventSource = new EventSource("/api/stream");

//     eventSource.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.username) {
//         setNotifications((prev) => [data, ...prev]);
//       }
//     };

//     eventSource.onerror = (err) => {
//       console.error("SSE error:", err);
//       eventSource.close();
//     };

//     return () => eventSource.close();
//   }, []);

//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Live Notifications</h1>
//       {notifications.length === 0 ? (
//         <p>No notifications yet...</p>
//       ) : (
//         <ul>
//           {notifications.map((n, i) => (
//             <li key={i}>
//               🟢 {n.username} clicked at {n.time}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
