import { MouseEventHandler, PropsWithChildren } from "react";
import Link from "next/link";
import styles from "./Button.module.css";

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  href?: string;
  locale?: string;
};

export default function Button(props: PropsWithChildren<ButtonProps>) {
  return (
    <div className={styles.btn}>
      <Link href={props.href} onClick={props.onClick} locale={props.locale}>
        {props.children}
      </Link>
    </div>
  );
}
