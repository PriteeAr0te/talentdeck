import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const noLayoutRoutes = ["/login", "/register"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isNoRoutes = noLayoutRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        transition={Slide}
        className="z-50"
        autoClose={3000}
        closeButton={true}
        pauseOnHover={true}
      />

      {isNoRoutes ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}
