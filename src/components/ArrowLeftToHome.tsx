"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const ArrowLeftToHome = () => {
  return (
    <Link href={"/"} className="flex items-center">
      {" "}
      <ArrowLeft />
      <p className="font-bold hover:font-extrabold">Inicio</p>
    </Link>
  );
};
