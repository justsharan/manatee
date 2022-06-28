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
      {props.href && (
        <Link href={props.href} locale={props.locale}>
          {props.children}
        </Link>
      )}
      {props.onClick && <a onClick={props.onClick}>{props.children}</a>}
    </div>
  );
}
