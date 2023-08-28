// pages/_app.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../../node_modules/@mdi/font/css/materialdesignicons.min.css";
import "../../styles/globals.css";
import '../public/mdi.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Listen for route changes and show/hide loading template
  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <div>
      {/* Your loading template */}
      {isLoading && (
        <div className="w-100 h-screen text-center flex justify-center items-center">
          <div className="relative">
            <div className="w-20 h-20 border-green-200 border-2 rounded-full"></div>
            <div className="w-20 h-20 border-green-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
          </div>
        </div>
      )}

      {/* Render the actual page */}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
