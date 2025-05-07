import Link from "next/link";
import styles from "./menuBtn.module.css";

const MenuBtn = ({text, link}) => {
    return(
        <Link className={styles.playBtn} href = {`${link}`}>
            {text}
        </Link>
    )
}

export default MenuBtn;