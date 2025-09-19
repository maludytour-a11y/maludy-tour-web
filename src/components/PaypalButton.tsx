"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadScript, PayPalNamespace } from "@paypal/paypal-js";
import { useRouter } from "@/i18n/navigation";

interface PaypalButtonProps {
  price: string;
  description: string;
  currency?: string;
}

export default function PaypalButton({ price, description, currency = "USD" }: PaypalButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [paypal, setPaypal] = useState<PayPalNamespace | null>(null);
  const route = useRouter();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error("No se encontró NEXT_PUBLIC_PAYPAL_CLIENT_ID");
      return;
    }

    loadScript({
      clientId,
      currency,
      intent: "capture",
    })
      .then((paypalNamespace) => {
        setPaypal(paypalNamespace);
        setSdkReady(true);
      })
      .catch((err) => {
        console.error("Error cargando PayPal SDK:", err);
      });
  }, [currency]);

  const createOrder = async (): Promise<string> => {
    const resp = await axios.post("/api/paypal/create-order", {
      price,
      description,
    });
    return resp.data.orderID;
  };

  const onApprove = async (data: any, actions: any) => {
    const resp = await axios.post("/api/paypal/capture-order", {
      orderID: data.orderID,
    });
    route.push("/success");
  };

  useEffect(() => {
    if (!sdkReady || !paypal) {
      return;
    }

    // Verificar que Buttons exista
    if (paypal.Buttons) {
      paypal
        .Buttons({
          createOrder: (data, actions) => {
            return createOrder();
          },
          onApprove: (data, actions) => {
            return onApprove(data, actions);
          },
          style: {
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
        })
        .render("#paypal-button-container");
    } else {
      console.error("paypal.Buttons no está definido");
    }
  }, [sdkReady, paypal]);

  return <div id="paypal-button-container"></div>;
}
