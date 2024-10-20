import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { useWalletClient } from "wagmi";

import { colors } from "@uikit/theme";
import { BoldP, H2, Text, TinyText } from "@uikit/typographic";
import { DAO_ABI, ERC20_ABI, REGISTORY_ABI, REGISTORY_ADDRESS } from "./contract";
import { ManifestDAO } from "./Create";
import { formatUnits } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const HomeScreen = () => {
  const { data: client } = useWalletClient();
  const navigate = useNavigate();
  const [list, setList] = useState<
    {
      manifest: ManifestDAO;
      dao: string;
      balance: bigint;
      token: string;
      symbol: string;
      decimal: number;
    }[]
  >([]);

  useEffect(() => {
    if (!client) return setList([]);
    const loadDAOs = async () => {
      const daos = await readContract(client, {
        address: REGISTORY_ADDRESS,
        functionName: "getDaos",
        abi: REGISTORY_ABI,
      });

      setList([]);
      (daos as any[]).map(async (dao) => {
        const [hash, token] = await Promise.all([
          readContract(client, { abi: DAO_ABI, functionName: "manifest", address: dao }),
          readContract(client, { abi: DAO_ABI, functionName: "tokenAddress", address: dao }),
        ]);

        const [balance, symbol, decimal] = await Promise.all([
          readContract(client, { abi: ERC20_ABI, functionName: "balanceOf", address: token as any, args: [dao] }),
          readContract(client, { abi: ERC20_ABI, functionName: "symbol", address: token as any }),
          readContract(client, { abi: ERC20_ABI, functionName: "decimals", address: token as any }),
        ]);

        const manifest = await fetch(`https://ipfs.hotdao.ai/ipfs/${hash}`).then((r) => r.json());
        setList((t) => [...t, { dao, manifest, balance, token, symbol, decimal } as any]);
      });
    };

    loadDAOs();
  }, [client]);

  if (client == null) return null;
  if (client?.account == null) {
    return (
      <Root>
        <H2>Connect wallet</H2>
        <Text>To explore MAOs on any blockchains</Text>
        <ConnectButton />
      </Root>
    );
  }

  return (
    <Root>
      <H2>{client?.chain.name} MAOs</H2>
      <Grid>
        {list
          .sort((a, b) => b.manifest.created_ts - a.manifest.created_ts)
          .map((item) => (
            <Card onClick={() => navigate(`/dao/${client.chain.id}/${item.dao}`)}>
              <BoldP>{item.manifest.name}</BoldP>

              <div>
                <TinyText>MANIFEST</TinyText>
                <Text style={{ marginTop: 4 }}>{item.manifest.manifests[0]?.prompt}</Text>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div>
                  <TinyText>DISTRIBUTION</TinyText>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    <img style={{ width: 20, height: 20, borderRadius: "50%" }} src={`https://storage.herewallet.app/ft/${item.token.toLowerCase()}.png`} />
                    <Text>
                      {formatUnits(item.balance, item.decimal)} {item.symbol}
                    </Text>
                  </div>
                </div>

                <div>
                  <TinyText>CREATED AT</TinyText>
                  <Text style={{ marginTop: 4 }}>{new Date(item.manifest.created_ts * 1000).toDateString()}</Text>
                </div>
              </div>
            </Card>
          ))}
      </Grid>
    </Root>
  );
};

const Root = styled.div`
  max-width: 1200px;
  margin: 24px auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${colors.controlsSecondary};
  border-radius: 16px;
  border: 1px solid ${colors.border};
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  p {
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  &:hover {
    border: 1px solid ${colors.blackPrimary};
  }
`;

export default observer(HomeScreen);
