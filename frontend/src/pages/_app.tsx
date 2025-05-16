import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/Layout"
import { AuthProvider } from "@/context/AuthContext";

const noLayoutRoutes = ["/login", "/register"];

export default function App({ Component, pageProps, router }: AppProps & { router: any }) {

  const isNoRoutes = noLayoutRoutes.includes(router.pathname);

  return isNoRoutes ? (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  ) : (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
