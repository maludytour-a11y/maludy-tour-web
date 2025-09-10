interface IAgencyInfo {
  name: string;
  initials: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    web: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    WhatsAppTextAbout?: string;
  };
  metadata: {
    home: {
      title: string;
      description: string;
    };
    about: {
      description: string;
      openGraph: {
        description: string;
      };
    };
  };
  providers: {
    resend: {
      domain: string;
      apikkey: string;
    };
  };
  texts: {
    about: {
      sloganText: string;
      text1: string;
      text2: string;
      text3: string;
      coverageText: string;
    };
  };
  mainActivity: {
    titleText1: string;
    titleText2: string;
    titleText3: string;
    summaryText: string;
    rating: number;
    reviews: number;
    duration: string;
    languages: string;
    img1: string;
    img2: string;
    img3: string;
    img4: string;
    price: number;
    id: string;
  };
}

export const agencyInfo: IAgencyInfo = {
  name: "Maludy Tour",
  initials: "MT",
  logo: "https://hplnvzhpsyauclwy.public.blob.vercel-storage.com/admin/maludy-logo",
  contact: {
    email: "maludytour@gmail.com",
    phone: "+18297732814",
    web: process.env.ORIGIN_URL?.toString() || "http://localhost:3000",
    address: "Bavaro, La Altagracia, R.D.",
    WhatsAppTextAbout: "Hola, quiero información sobre sus tours.",
  },
  metadata: {
    home: {
      title: "Maludy Tour",
      description: "Mejor tour cultural en Punta Cana",
    },
    about: {
      description: "Conoce a Maludy Tour: un equipo local apasionado por crear experiencias auténticas en Punta Cana, con atención cercana, guías bilingües y soporte confiable.",
      openGraph: {
        description: "Conoce a Maludy Tour: un equipo local apasionado por crear experiencias auténticas en Punta Cana.",
      },
    },
  },
  providers: {
    resend: {
      domain: "<booking@maludytour.com>",
      apikkey: process.env.RESEND_API_KEY?.toString() || "",
    },
  },
  texts: {
    about: {
      sloganText: "Turismo con esencia local: cercanía, seguridad y calidad.",
      text1: "creemos que un buen tour es mucho más que visitar lugares. Es vivir el destino con tranquilidad, con guías que conocen cada detalle y un equipo que te acompaña de principio a fin.",
      text2: "Trabajamos con grupos reducidos y proveedores confiables para asegurar una experiencia cómoda, segura y memorable. Nuestro objetivo es que disfrutes sin preocupaciones: logística clara, comunicación constante y atención personalizada.",
      text3: "Ya sea que viajes en familia, con amigos o en pareja, te ayudamos a encontrar la actividad ideal, adaptada a tus tiempos e intereses.",
      coverageText: "Coordinamos recogidas en hoteles y puntos de encuentro, y trabajamos con operadores locales que cumplen altos estándares de calidad y seguridad.",
    },
  },
  mainActivity: {
    titleText1: "TOUR GUIADO",
    titleText2: "VAMOS AL CAMPO",
    titleText3: "DESDE PUNTA CANA",
    summaryText: "Disfruta de un día de aventura y cultura dominicana: salto de agua, basílica, finca de cacao y almuerzo típico. Grupo reducido y guía local.",
    rating: 4.9,
    reviews: 585,
    duration: "7–8 h",
    languages: "ES / EN",
    img1: "/images/casa-tipica.jpg",
    img2: "/images/basilica.jpeg",
    img3: "/images/tabaco.jpg",
    img4: "/images/caballo.jpg",
    price: 55,
    id: "a0b3445c-b925-4b63-9d72-158fafafb8f8",
  },
};
