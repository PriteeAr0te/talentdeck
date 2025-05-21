import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div data-theme="dark">
            <Header />
            <main className="min-h-100 w-full">{children}</main>
            <Footer />
        </div>
    )
};

export default Layout;
