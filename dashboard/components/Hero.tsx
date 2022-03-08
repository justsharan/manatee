import { FC } from "react";

import styles from "./Hero.module.css";

type HeroProps = {
  img?: string;
  manatee?: boolean;
};

const Hero: FC<HeroProps> = ({ children, ...props }) => (
  <header className={styles.hero}>
    {props.img && <img src={props.img} />}
    <div className={props.manatee && styles.manatee}>{children}</div>
  </header>
);

export default Hero;
