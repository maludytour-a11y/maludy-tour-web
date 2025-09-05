"use client";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Rate from "@/components/ui/rate";
import { IActivityItemResponse } from "@/app/api/activities/route";

const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" });

export const ActivityCard = ({ activity }: { activity: IActivityItemResponse }) => {
  const ratingNum = Number(activity.rating ?? 0);
  const reviewsNum = Number(activity.reviews ?? 0);

  return (
    <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border">
      {/* Cover */}
      <div className="relative h-56">
        <Image src={activity.image} alt={activity.title} fill className="object-cover" sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" />

        {activity.badge && (
          <Badge className="absolute left-3 top-3 bg-white/90 text-neutral-900 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1" variant="secondary">
            <Flame className="h-3.5 w-3.5" />
            {String(activity.badge).toUpperCase()}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold leading-snug">{activity.title}</h3>

            <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" /> {activity.location}
            </p>
            <p className="text-sm text-neutral-500 flex items-center gap-1">
              <Clock className="h-4 w-4" /> {activity.duration}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <Rate value={ratingNum} />
              <span className="text-xs text-neutral-500">
                {ratingNum.toFixed(1)} · {reviewsNum.toLocaleString()} reseñas
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-xs text-neutral-500">Desde</p>
            <p className="text-xl font-bold">{currency.format(Number(activity.price ?? 0))}</p>
            <p className="text-xs text-neutral-500">/persona</p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-600">
            <Link href={`/activities/${activity.id}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
