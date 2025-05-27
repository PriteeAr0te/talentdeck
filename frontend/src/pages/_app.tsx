import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/Layout"
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";

const noLayoutRoutes = ["/login", "/register"];

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

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
