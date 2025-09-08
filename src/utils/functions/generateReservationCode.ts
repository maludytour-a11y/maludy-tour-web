import { agencyInfo } from "@/config";

export const generateReservationCode = () => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const length = 8;
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }

  return `${agencyInfo.initials.toUpperCase()}-${code}`;
};
