import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { getBalance, waitForTransactionReceipt } from "viem/actions";
import { useNavigate } from "react-router-dom";
import { useWalletClient } from "wagmi";
import { isAddress } from "viem";
import { useState } from "react";

import { ActionButton } from "@uikit/button";
import { BoldP, SmallText } from "@uikit/typographic";
import { colors } from "@uikit/theme";
import HereInput from "@uikit/Input";
import Icon from "@uikit/Icon";

import chatgtpIcon from "./assets/chatgpt.png";
import { DAO_ABI, DAO_CODE, REGISTORY_ADDRESS } from "./contract";

export interface ManifestDAO {
  name: string;
  created_ts: number;
  manifests: {
    level: 0 | 1 | 2;
    rules: { source: "GRAPH" }[];
    tweet: { from: "*" | string };
    prompt: string;

    type: "send";
    if_left: "RESULT";
    if_op: ">" | ">=" | "=" | "<" | "<=";
    if_right: number;

    amount: "RESULT" | number;
    to: "TWITTER_ADDRESS" | `0x${string}`;
  }[];
}

const CreateDao = () => {
  const navigate = useNavigate();
  const { data: client } = useWalletClient();
  const [isLoading, setLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [manifest, setManifest] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");

  const deploy = async () => {
    try {
      setLoading(true);
      const config = JSON.stringify({
        name,
        created_ts: Math.floor(Date.now() / 1000),
        manifests: [
          {
            level: 0,
            prompt: manifest,
            amount: "RESULT",
            to: "TWITTER_ADDRESS",
            tweet: { from: "*" },
            rules: [],

            type: "send",
            if_left: "RESULT",
            if_op: ">",
            if_right: 0,
          },
        ],
      } as ManifestDAO);

      const file = new File([config], "dao.json", { type: "text/plain" });
      const { hash } = await fetch("https://api.herewallet.app/api/v1/evm/ipfs/v0/add", {
        headers: { "Content-Type": file.type },
        method: "POST",
        body: file,
      }).then((r) => r.json());

      const balance = await getBalance(client!, { address: tokenAddress as any });
      const result = await client?.deployContract({
        args: [tokenAddress, tokenAddress, hash, 0n, 0n, REGISTORY_ADDRESS],
        bytecode: `0x${DAO_CODE}`,
        abi: DAO_ABI,
      });

      const receipt = await waitForTransactionReceipt(client!, { hash: result! });
      navigate("/dao/" + receipt.contractAddress);
      console.log({ receipt });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <Fieild>
        <SmallText>DAO NAME</SmallText>
        <HereInput value={name} onChange={(e) => setName(e.target.value)} label="DAO" style={{ width: 300 }} />
      </Fieild>

      <Fieild>
        <SmallText>DISTRIBUTION</SmallText>
        <div style={{ display: "flex", gap: 16 }}>
          <HereInput style={{ width: "70%" }} hasError={!isAddress(tokenAddress)} value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} label="Token address" />
          <HereInput value={amount} onChange={(e) => setAmount(e.target.value)} label="Amount of tokens" />
        </div>
      </Fieild>

      <Fieild>
        <SmallText>DAO MANIFEST</SmallText>
        <HereInput value={manifest} onChange={(e) => setManifest(e.target.value)} multiline style={{ height: 200 }} label="YOUR CHATGPT PROMPT" placeholder="" />
      </Fieild>

      <Fieild>
        <SmallText>DO</SmallText>
        <div style={{ width: "fit-content", display: "flex", height: 46, border: `1px solid ${colors.borderHight}`, borderRadius: 16, background: colors.controlsSecondary }}>
          <div style={{ padding: "12px 20px", borderRight: `1px solid ${colors.border}` }}>
            <BoldP style={{ color: colors.blackSecondary }}>IF</BoldP>
          </div>
          <div style={{ padding: "12px 12px", borderRight: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <img src={chatgtpIcon} style={{ width: 32, height: 32, marginLeft: -4 }} />
            <BoldP>RESULT</BoldP>
          </div>
          <div style={{ padding: "12px 20px", borderRight: `1px solid ${colors.border}` }}>
            <BoldP>{">"}</BoldP>
          </div>
          <div style={{ padding: "12px 20px" }}>
            <BoldP>0</BoldP>
          </div>
        </div>

        <div style={{ width: "fit-content", display: "flex", border: `1px solid ${colors.borderHight}`, height: 46, borderRadius: 16, background: colors.controlsSecondary }}>
          <div style={{ padding: "12px 20px", borderRight: `1px solid ${colors.border}` }}>
            <BoldP style={{ color: colors.blackSecondary }}>SEND $BLACK</BoldP>
          </div>
          <div style={{ padding: "12px 12px", borderRight: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <img src={chatgtpIcon} style={{ width: 32, height: 32, marginLeft: -4 }} />
            <BoldP>RESULT</BoldP>
          </div>
          <div style={{ padding: "12px 20px", borderRight: `1px solid ${colors.border}` }}>
            <BoldP style={{ color: colors.blackSecondary }}>TO</BoldP>
          </div>
          <div style={{ padding: "12px 20px" }}>
            <BoldP>ADDRESS FROM TWEET</BoldP>
          </div>
        </div>
      </Fieild>

      <div style={{ marginTop: 24 }}>
        <ActionButton big isLoading={isLoading} onClick={() => deploy()}>
          DEPLOY DAO
          <Icon style={{ marginLeft: 16 }} name="rocket" />
        </ActionButton>

        <SmallText style={{ marginTop: 8 }}>Verification with SGX</SmallText>
      </div>
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

const Fieild = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default observer(CreateDao);
