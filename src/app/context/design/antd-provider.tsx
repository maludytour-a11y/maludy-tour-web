// src/app/antd-provider.tsx
"use client";

import React from "react";
import { ConfigProvider, App as AntApp } from "antd";

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      // Monta TODOS los popups/dropdowns dentro del contenedor del trigger
      getPopupContainer={(triggerNode) => (triggerNode?.parentElement as HTMLElement) ?? document.body}
      theme={{ hashed: true }}
    >
      {/* Contextos de message, modal, notification, etc. */}
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}
