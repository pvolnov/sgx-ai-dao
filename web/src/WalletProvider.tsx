import "@rainbow-me/rainbowkit/styles.css";

// import { HOT } from "@hot-wallet/sdk"; // @ts-ignore
import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { aurora, base, polygon } from "wagmi/chains";

// HOT.setupEthProvider?.(async (data: any, chain: any, address: any) => {
//   const result = await createProvider(getChain(chain), address || "").send(data.method, data.params);
//   return result;
// });

const queryClient = new QueryClient();
const config = getDefaultConfig({
  projectId: "170e35a2d31f9928bea678dbe3efcba6",
  chains: [base, polygon, aurora],
  appName: "MAO",
});

export const WalletProvider = ({ children }: { children: any }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
