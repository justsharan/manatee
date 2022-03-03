import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.css";

export default () => {
  const { data } = useSession();
  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <a href="/">
          <img src="/manatee.png" />
        </a>
        <a href="/docs">Docs</a>
        <a href="/invite">Invite</a>
        <a href="/discord">Discord</a>
      </div>
      <div className={styles.userinfo}>
        {data ? (
          <>
            <img src={data.user.image} />
            <a href="/guilds">{data.user.name}</a>
            <a
              className={styles.btn}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </a>
          </>
        ) : (
          <a
            className={styles.btn}
            onClick={() => signIn("discord", { callbackUrl: "/guilds" })}
          >
            Log in
          </a>
        )}
      </div>
    </nav>
  );
};
