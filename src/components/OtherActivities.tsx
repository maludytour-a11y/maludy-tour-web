"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "../components";
import { BadgeType } from "@/generated/prisma";
import { useTranslations } from "next-intl";

type Activity = {
  id: string;
  image: string;
  price: number;
  title: string;
  location: string;
  duration: string;
  rating: number;
  reviews: number;
  badge: BadgeType;
};

export const OtherActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const al = useTranslations("ActivitiesList");
  const b = useTranslations("Btn");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/activities?limit=8&page=1`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        setActivities(data.activities ?? []);
      } catch {
        // silencioso: no romper UI si falla
      }
    })();
    return () => controller.abort();
  }, []);

  return (
    <section className="py-14 bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900">{al("OtherActivities")}</h2>
            <p className="text-neutral-600">{al("OtherActivitiesSub")}</p>
          </div>

          <Button asChild className="rounded-full">
            <Link href="/activities">{b("ViewAll")}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      </div>
    </section>
  );
};
