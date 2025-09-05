interface IAgencyInfo {
  name: string;
  contact: {
    email: string;
    phone: string;
    web: string;
  };
}

export const agencyInfo: IAgencyInfo = {
  name: "Maludy Tour",
  contact: {
    email: "maludytour@gmail.com",
    phone: "+18297732814",
    web: "https://www.maludytour.com",
  },
};
