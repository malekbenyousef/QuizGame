"use client"

import { useSearchParams } from "next/navigation";
import MenuBtn from "./components/MenuBtn/MenuBtn";
import Modal from "./components/modalCatChoice/modalCatChoice";
import styles from "./quizHome.module.css";

export default function Home() {
  const SearchParams = useSearchParams();
  const show = SearchParams.get("show");
  console.log(show);

  return (
    <div className = {styles.container}>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className= {styles.title}>FakeQuizly</h1>
          <p className={styles.subtitle}>Play an infinite number of possible questions</p>
        </div>

        <div style={{width: '50%', marginBottom: '30px'}}>
          <MenuBtn text = "Join" link = "/join" />
          <MenuBtn text = "Play" link = "/?show=true" />

          {show && <Modal />}
        </div>
      </div>
    </div>
  );
}
