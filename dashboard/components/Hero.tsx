import { FC } from "react";

import styles from "./Hero.module.css";

const Hero: FC<{ img?: string }> = ({ img, children }) => (
  <header className={styles.hero}>
    {img && <img src={img} />}
    <div>{children}</div>
  </header>
);

export default Hero;
