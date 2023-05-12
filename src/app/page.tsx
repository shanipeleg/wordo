"use client";
import { CookiesProvider } from "react-cookie";
import Wordo from "./components/wordo/wordo";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      <main className="flex min-h-screen flex-col items-center justify-between">
        <CookiesProvider>
          <Wordo />
        </CookiesProvider>
      </main>
    </div>
  );
}
