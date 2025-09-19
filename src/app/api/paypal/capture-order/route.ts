import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orderID }: { orderID: string } = await request.json();

  if (!orderID) {
    return NextResponse.json({ error: "Falta orderID" }, { status: 400 });
  }

  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_API = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

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
    console.error("Error autenticando para captura:", tokenJson);
    return NextResponse.json({ error: "Error obteniendo token" }, { status: tokenRes.status });
  }
  const accessToken = tokenJson.access_token;

  const captureRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const captureJson = await captureRes.json();
  if (!captureRes.ok) {
    console.error("Error capturando orden:", captureJson);
    return NextResponse.json({ error: "Error en captura", details: captureJson }, { status: captureRes.status });
  }

  return NextResponse.json({ captureResult: captureJson });
}
