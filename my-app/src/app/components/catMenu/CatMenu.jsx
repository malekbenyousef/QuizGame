"use client"
import styles from "./catMenu.module.css";
import Image from "next/image";

const MainCat = () => {
    const categories = [
        {name: "History", logo: "/globe.svg", color: "#E6C642"},
        {name: "Entertainment", logo: "/globe.svg", color: "#F04B4B"},
        {name: "Technology", logo: "/globe.svg", color: "#685AF5"},
        {name: "Geography", logo: "/globe.svg", color: "#3AE153"},
        {name: "Art", logo: "/globe.svg", color: "#307DE7"},
        {name: "Science", logo: "/globe.svg", color: "#A656FD"},
        {name: "Programming", logo: "/globe.svg", color: "#E857ED"}
    ]

    return(
    <div className={styles.container}>
        <h1>Game Modes</h1>

        <div className={styles.gameModes}>
            <div className={styles.mode}>
                <h3>Classic</h3>
                <p>Complete questions without fail to win! You can have wilcards that can help you</p>    
            </div>

            <div className={styles.mode}>
                <h3>Time</h3>
                <p>Complete timed questions to win! You have wilcards that can help you</p>    
            </div>

            <div className={styles.mode}>
                <h3>Infinite</h3>
                <p>Complete as many questions without fail to win! You have wilcards that can be used and bought</p>    
            </div>
        </div>

        <div>
            <h1>Categories</h1>

            <ul className={styles.catList}>
                {categories.map((cat) => {
                    return (
                        <li
                        style={{backgroundColor: cat.color}}
                        key={cat.name}>
                            <Image
                            width={15}
                            height={15} 
                            src={cat.logo} 
                            alt = {cat.name + " logo"} />
                            {cat.name}
                        </li>
                    );
                })}
            </ul>
        </div>
    </div>

    );
}
export default MainCat;