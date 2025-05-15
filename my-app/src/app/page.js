"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import MenuBtn from "./components/MenuBtn/MenuBtn";
import Modal from "./components/modalCatChoice/modalCatChoice";
import LoginModal from "./components/LoginModal/LoginModal";
import styles from "./quizHome.module.css";

export default function Home() {
  const searchParams = useSearchParams();
  const show = searchParams.get("show");

  const [showLoginModal, setShowLoginModal] = useState(false);

const handleLoginSubmit = async (username) => {
  

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('Logged in successfully:', data);
    alert('Logged in successfully')
    // You can store user info in localStorage or state if needed
    // localStorage.setItem('user', JSON.stringify(data.user));

    // You can also trigger any further logic, like showing the next page, etc.
  } catch (err) {
    console.error('Login error:', err.message);
    alert(`Login failed: ${err.message}`);
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>FakeQuizly</h1>
          <p className={styles.subtitle}>
            Play an infinite number of possible questions
          </p>
        </div>

        <div style={{ width: "50%", marginBottom: "30px" }}>
          <MenuBtn text="Join" link="/join" />
          <MenuBtn text="Play" link="/?show=true" />
          <button onClick={() => setShowLoginModal(true)}>Login</button>

          {show && <Modal />}
          {showLoginModal && (
            <LoginModal
              onClose={() => setShowLoginModal(false)}
              onSubmit={handleLoginSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
