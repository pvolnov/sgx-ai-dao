import { BrowserProvider, JsonRpcSigner } from "ethers";
import { type Account, type Chain, type Client, type Transport } from "viem";
import { type Config, useConnectorClient } from "wagmi";
import { switchChain } from "viem/actions";
import { useMemo } from "react";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = { chainId: chain.id, name: chain.name, ensAddress: chain.contracts?.ensRegistry?.address };

  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);

  // @ts-ignore
  signer.connect = async (provider) => {
    console.log("connect", provider);
    if (!provider) return signer;
    const net = await provider.getNetwork();
    await switchChain(client, { id: Number(net.chainId) });
    return signer;
  };

  return signer;
}

export function useEthersSigner(chain?: number) {
  const { data: client } = useConnectorClient<Config>({ chainId: chain });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
