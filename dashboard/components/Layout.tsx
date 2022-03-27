import { FC } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

import styles from "./Layout.module.css";

const Layout: FC = ({ children }) => (
  <>
    <Navbar />
    <main className={styles.content}>{children}</main>
    <Footer />
  </>
);

export default Layout;
