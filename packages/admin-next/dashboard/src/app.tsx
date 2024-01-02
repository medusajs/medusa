import { Toaster } from "@medusajs/ui";
import { MedusaProvider } from "medusa-react";

import { AuthProvider } from "./providers/auth-provider";
import { RouterProvider } from "./providers/router-provider";
import { ThemeProvider } from "./providers/theme-provider";

import { queryClient } from "./lib/medusa";

function App() {
  return (
    <MedusaProvider
      baseUrl="http://localhost:9000"
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </MedusaProvider>
  );
}

export default App;
