import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <main className="min-h-100 w-full border">{children}</main>
            <Footer />
        </>
    )
};

export default Layout;
