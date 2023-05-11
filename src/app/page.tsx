"use client";
import { CookiesProvider } from "react-cookie";
import Wordle from "./components/wordle/wordle";
import Wordo from "./components/wordo/wordo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <CookiesProvider>
        {/* <Wordle /> */}
        <Wordo />
      </CookiesProvider>
    </main>
  );
}
