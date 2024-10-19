import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { createPublicClient } from "viem";
import { readContract } from "viem/actions";
import { base } from "viem/chains";
import { http } from "wagmi";

import { colors } from "@uikit/theme";
import { H2, SmallText, Text } from "@uikit/typographic";
import { DAO_ABI, REGISTORY_ABI, REGISTORY_ADDRESS } from "./contract";
import { ManifestDAO } from "./Create";

export const publicClient = createPublicClient({
  transport: http(),
  chain: base,
});

const HomeScreen = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<{ manifest: ManifestDAO; dao: string }[]>([]);

  useEffect(() => {
    const loadDAOs = async () => {
      const daos = await readContract(publicClient, {
        address: REGISTORY_ADDRESS,
        functionName: "getDaos",
        abi: REGISTORY_ABI,
      });

      setList([]);
      (daos as any[]).map(async (dao) => {
        const hash = await readContract(publicClient, { abi: DAO_ABI, functionName: "manifest", address: dao });
        const manifest = await fetch(`https://ipfs.hotdao.ai/ipfs/${hash}`).then((r) => r.json());
        setList((t) => [...t, { dao, manifest }]);
      });
    };

    loadDAOs();
  }, []);

  console.log({ list });

  return (
    <Root>
      <H2>AI DAOs</H2>
      {list.map((item) => (
        <Card onClick={() => navigate("/dao/" + item.dao)}>
          <Text>{item.manifest.name}</Text>
          <SmallText>{item.manifest.manifests[0]?.prompt}</SmallText>
        </Card>
      ))}
    </Root>
  );
};

const Root = styled.div`
  max-width: 920px;
  margin: 64px auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
`;

const Card = styled.div`
  background: ${colors.controlsSecondary};
  border-radius: 16px;
  border: 1px solid ${colors.border};
  padding: 16px;
  cursor: pointer;
  p {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
`;

export default observer(HomeScreen);
