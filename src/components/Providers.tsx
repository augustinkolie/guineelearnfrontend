"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: React.ReactNode }) {
    // On utilise un ID factice pour éviter que useGoogleLogin ne fasse planter l'application
    // si l'ID réel n'est pas encore configuré dans le .env
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "no-client-id-configured";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
