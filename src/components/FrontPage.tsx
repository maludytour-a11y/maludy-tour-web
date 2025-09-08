import { Hero } from "./Hero";
import { NavBar } from "./NavBar";

export default function FrontPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <NavBar />
      <main className="flex-1 flex">
        <Hero />
      </main>
    </div>
  );
}
