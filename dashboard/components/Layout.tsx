import { FC } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout: FC = ({ children }) => (
  <>
    <Navbar />
    <main style={{ width: "70vw", margin: "0 auto" }}>{children}</main>
    <Footer />
  </>
);

export default Layout;
