import { MouseEventHandler, PropsWithChildren } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  href?: string;
};

export default function Button(props: PropsWithChildren<ButtonProps>) {
  return (
    <a href={props.href} onClick={props.onClick} className={styles.btn}>
      {props.children}
    </a>
  );
}
