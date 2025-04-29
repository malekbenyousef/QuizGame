import Link from "next/link";
import MainCat from "./components/catMenu/CatMenu";
import styles from "./quizHome.module.css";

export default function Home() {
  return (
    <div className = {styles.container}>
      <MainCat />

      <div style={{position: 'relative'}}>
        <div  className= {styles.titleScreen}>

        <h1 className= {styles.header}>FakeQuizly</h1>
        <p className={styles.subheader}>Play an infinite number of possible questions</p>
        

        <Link href="/">
          <button className={styles.playBtn}>PLAY NOW</button>
        </Link>
        </div>
    </div>
      </div>
  );
}
