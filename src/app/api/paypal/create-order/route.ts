import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { price, description }: { price: string; description: string } = await request.json();

  if (!price || !description) {
    return NextResponse.json({ error: "Faltan precio o descripción" }, { status: 400 });
  }

  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_API = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

  // Obtener access token
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error("Error al obtener token de PayPal:", tokenJson);
    return NextResponse.json({ error: "Error autenticando con PayPal" }, { status: tokenRes.status });
  }
  const accessToken = tokenJson.access_token;

  // Crear la orden
  const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // cambiar si usas otra moneda
            value: price,
          },
          description: description,
        },
      ],
    }),
  });

  const orderJson = await orderRes.json();
  if (!orderRes.ok) {
    console.error("Error creando la orden:", orderJson);
    return NextResponse.json({ error: "No se pudo crear la orden", details: orderJson }, { status: orderRes.status });
  }

  return NextResponse.json({ orderID: orderJson.id });
}
