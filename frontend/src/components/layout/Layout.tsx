import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div data-theme="dark">
            <Header />
            <main className="min-h-100 w-full bg-background mb-16">{children}</main>
            <div className="max-h-[105px]">
                <Footer />
            </div>
        </div>
    )
};

export default Layout;
