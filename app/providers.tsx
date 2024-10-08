// see: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup

"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // with ssr, set some default staleTime above 0
        // to avoid refetching immediately on the client
        staleTime: 60_000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  return isServer
    // server: always make a new query client
    ? makeQueryClient()
    // browser: make a new query client if we don't already have one
    : (browserQueryClient ||= makeQueryClient());
}

export default function Providers({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
