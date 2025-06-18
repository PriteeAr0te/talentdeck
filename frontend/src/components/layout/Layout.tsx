import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div data-theme="dark">
            <Header />
            <main className="min-h-100 w-full pb-12 dark:bg-[#0A0011]">{children}</main>
            <Footer />
        </div>
    )
};

export default Layout;
