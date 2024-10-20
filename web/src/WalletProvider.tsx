import "@rainbow-me/rainbowkit/styles.css";

// import { HOT } from "@hot-wallet/sdk"; // @ts-ignore
import { WagmiProvider } from "wagmi";
import { darkTheme, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { aurora, base, hederaTestnet, polygon, rootstockTestnet } from "wagmi/chains";

// HOT.setupEthProvider?.(async (data: any, chain: any, address: any) => {
//   const result = await createProvider(getChain(chain), address || "").send(data.method, data.params);
//   return result;
// });

const nets = {
  base: base,
  polygon: polygon,
  aurora: aurora,
  rootstock: rootstockTestnet,
  hedera: hederaTestnet,
  airdao: {
    id: 22040,
    name: "AirDAO Testnet",
    nativeCurrency: { decimals: 18, name: "AMB", symbol: "AMB" },
    rpcUrls: { default: { http: ["https://network.ambrosus-test.io"] } },
    testnet: true,
  },
};

const selected = Object.entries(nets).find((t) => location.search.slice(1).includes(t[0]))?.[1] || Object.values(nets);
const queryClient = new QueryClient();
const config = getDefaultConfig({
  projectId: "170e35a2d31f9928bea678dbe3efcba6",
  chains: (Array.isArray(selected) ? selected : [selected]) as any,
  appName: "MAO",
});

export const WalletProvider = ({ children }: { children: any }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
