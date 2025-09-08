"use client";
import { useState } from "react";

export default function ClientCrash() {
  const [boom, setBoom] = useState(false);
  if (boom) throw new Error("Client crash test");
  return (
    <button className="rounded-lg border px-4 py-2" onClick={() => setBoom(true)}>
      Error en cliente
    </button>
  );
}
