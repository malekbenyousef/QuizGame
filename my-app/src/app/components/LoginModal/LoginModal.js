"use client";

import { useState } from "react";
import styles from "./LoginModal.module.css";

export default function LoginModal({ onClose, onSubmit }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username); // Pass the username to parent
    onClose(); // Close the modal
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        <button className={styles.closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
