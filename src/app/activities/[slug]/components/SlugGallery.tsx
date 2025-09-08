"use client";
import Image from "next/image";

type image = {
  url: string;
};

interface SlugGalleryProps {
  images: image[];
  title: string;
}

export const SlugGallery = (props: SlugGalleryProps) => {
  const { images, title } = props;
  return (
    <div className="grid mb-5 grid-cols-3 gap-3 rounded-2xl overflow-hidden">
      <div className="col-span-3 md:col-span-2 relative h-64 md:h-[360px]">
        <Image src={images[0].url} alt={title} fill className="object-cover" sizes="(min-width:1024px) 66vw, 100vw" priority />
      </div>
      <div className="hidden md:grid md:grid-rows-3 md:gap-3">
        {images.slice(1, 4).map((img, i) => (
          <div key={i} className="relative h-[110px]">
            <Image src={img.url} alt={`${title} ${i + 2}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};
