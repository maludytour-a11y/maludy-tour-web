import { Hero, NavBar, OtherActivities } from "@/components";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <NavBar />
      <main className="flex-1 flex flex-col">
        {" "}
        {/* ← columna */}
        <Hero />
        <OtherActivities />
        <Footer />
      </main>
    </div>
  );
}
