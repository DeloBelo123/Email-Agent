import { OnlineStatusManager } from "./StatusManager";
import { PushNotificationManager } from "../components/PushNotificationManager";
import type { Metadata } from "next";
import "./globals.css";
import { CategorieContextProvider } from "./readMails/CategorieContext";
import { ReplyProvider } from "./ReplyContext";
import QueryContext from "../../myLibUI/Hooks/Context/QueryContext";
import { SettingsButton } from "../components/SettingsButton";

export const metadata: Metadata = {
  title: "email-Agent",
  description: "nie wieder kopfschmerzen wegen mails",
};


export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>
        <QueryContext>
          <CategorieContextProvider>
            <ReplyProvider>
              <OnlineStatusManager />
              <PushNotificationManager />
              {children}
              <SettingsButton />
            </ReplyProvider>
          </CategorieContextProvider>
        </QueryContext>
      </body>
    </html>
  );
}
