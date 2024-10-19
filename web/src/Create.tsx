import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { waitForTransactionReceipt } from "viem/actions";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { useNavigate } from "react-router-dom";
import { ethers, formatUnits, parseUnits } from "ethers";
import { useWalletClient } from "wagmi";
import { isAddress } from "viem";
import { useState } from "react";
import uuid4 from "uuid4";

import { ActionButton } from "@uikit/button";
import { BoldP, SmallText } from "@uikit/typographic";
import { colors } from "@uikit/theme";
import HereInput from "@uikit/Input";
import Icon from "@uikit/Icon";

import chatgtpIcon from "./assets/chatgpt.png";
import { DAO_ABI, DAO_CODE, ERC20_ABI, REGISTORY_ADDRESS, TEE } from "./contract";
import { useEthersSigner } from "./useEtherProvider";
import { notify } from "./toast";

export const formatNumber = (num: string) => {
  var useDelimeter = false;
  var right = "";
  var left = "";

  let chars = num.split("");
  chars.forEach((char) => {
    const isNumber = char >= "0" && char <= "9";
    if (isNumber && useDelimeter) right += char;
    else if (isNumber && !useDelimeter) left += char;
    else if (char === "." || char === "," || char === ",") {
      if (left == "") left = "0";
      useDelimeter = true;
    }
  });

  return useDelimeter ? `${+left}.${right}` : `${+left}`;
};

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
  const [tweetsFrom, setTweetsFrom] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [manifest, setManifest] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState(2);
  const [ifResultAmount, setResultAmount] = useState("0");

  const etherClient = useEthersSigner();

  const [selectedToken, setSelectedToken] = useState<{ balance: bigint; symbol: string; decimal: number }>();

  const getMachineAddress = async (hash: string) => {
    if (!etherClient) return;
    const uuid = uuid4();
    const xmtp = await Client.create(etherClient, { env: "production" });
    const conversation = await xmtp.conversations.newConversation(TEE);

    const promiseMsg = (async () => {
      const isSender = (t: DecodedMessage<string | undefined>) => t.senderAddress.toLowerCase() !== etherClient.address.toLowerCase();
      const parseMessage = (t: DecodedMessage<string | undefined>) => {
        try {
          return JSON.parse(t.content!);
        } catch {
          return {};
        }
      };

      for await (const message of await conversation.streamMessages()) {
        console.log({ message });
        if (!isSender(message)) continue;
        const msg = parseMessage(message);
        if (msg.id === uuid) return msg.address;
      }
    })();

    await conversation?.send(JSON.stringify({ manifest_hash: hash, id: uuid }));
    return await promiseMsg;
  };

  const deploy = async () => {
    try {
      if (!etherClient) throw "Connect wallet to deploy";
      setLoading(true);

      if (!name) throw "Setup DAO name";
      if (name.length > 50) throw "DAO name too long (max 50)";
      if (!manifest) throw "Setup DAO manifest";
      if (!selectedToken) throw "Setup valid token address";
      if (!amount) throw "Setup DAO token amount";

      const config = JSON.stringify({
        name,
        created_ts: Math.floor(Date.now() / 1000),
        manifests: [
          {
            level: level,
            prompt: manifest,
            amount: "RESULT",
            to: "TWITTER_ADDRESS",
            tweet: { from: tweetsFrom || "*" },
            rules: [],

            type: "send",
            if_left: "RESULT",
            if_right: +ifResultAmount,
            if_op: ">",
          },
        ],
      } as ManifestDAO);

      const file = new File([config], "dao.json", { type: "text/plain" });
      const { hash } = await fetch("https://api.herewallet.app/api/v1/evm/ipfs/v0/add", {
        headers: { "Content-Type": file.type },
        method: "POST",
        body: file,
      }).then((r) => r.json());

      const address = await getMachineAddress(hash);
      const erc20 = new ethers.Contract(tokenAddress, ERC20_ABI, etherClient);

      let [balance, decimal] = await Promise.all([erc20.balanceOf(etherClient.address), erc20.decimals()]);
      balance = BigInt(balance);

      let int = parseUnits(amount, decimal);
      if (int > balance) int = balance;

      const result = await client?.deployContract({
        args: [tokenAddress, address, hash, int, 0n, REGISTORY_ADDRESS],
        bytecode: `0x${DAO_CODE}`,
        abi: DAO_ABI,
      });

      const receipt = await waitForTransactionReceipt(client!, { hash: result! });
      navigate("/dao/" + receipt.contractAddress);
      console.log({ receipt });
    } catch (e) {
      console.error(e);
      notify(e);
    } finally {
      setLoading(false);
    }
  };

  const setupToken = async (addr: string) => {
    setTokenAddress(addr);
    if (!isAddress(addr)) return setSelectedToken(undefined);
    const erc20 = new ethers.Contract(addr, ERC20_ABI, etherClient);
    const [balance, symbol, decimal] = await Promise.all([erc20.balanceOf(etherClient?.address), erc20.symbol(), erc20.decimals()]);
    setSelectedToken({ balance, symbol, decimal });
  };

  const tokenBalance = selectedToken ? formatUnits(selectedToken.balance, selectedToken.decimal) : 0;

  return (
    <Root>
      <Fieild>
        <SmallText>DAO NAME</SmallText>
        <HereInput value={name} onChange={(e) => setName(e.target.value)} label="DAO" style={{ width: 300 }} />
      </Fieild>

      <GroupField>
        <Fieild style={{ width: "70%" }}>
          <SmallText>DISTRIBUTION TOKEN</SmallText>
          <HereInput value={tokenAddress} onChange={(e) => setupToken(e.target.value)} label="Token address" />
        </Fieild>

        <Fieild style={{ flex: 1 }}>
          <SmallText>
            {tokenBalance} {selectedToken?.symbol || "TOKEN"}
          </SmallText>
          <HereInput value={amount} onChange={(e) => setAmount(e.target.value)} label="Amount of tokens" />
        </Fieild>
      </GroupField>

      <Fieild>
        <SmallText>DAO MANIFEST</SmallText>
        <HereInput value={manifest} onChange={(e) => setManifest(e.target.value)} multiline style={{ height: 200 }} label="YOUR CHATGPT PROMPT" placeholder="" />
      </Fieild>

      <GroupField>
        <Fieild style={{ flex: 1 }}>
          <SmallText>VALIDATE TWEETS ONLY FROM (OPTIONAL)</SmallText>
          <HereInput label="USERNAME" value={tweetsFrom} onChange={(e) => setTweetsFrom(e.target.value)} />
        </Fieild>

        <Fieild>
          <SmallText>LEVEL OF JUSTICE</SmallText>
          <div style={{ width: "fit-content", display: "flex", height: 56, borderRadius: 16, background: colors.controlsSecondary }}>
            <div
              onClick={() => setLevel(0)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "12px 20px",
                borderRadius: "16px 0 0 16px",
                border: `1px solid ${level === 0 ? colors.blackPrimary : colors.border}`,
                background: level === 0 ? colors.elevation1 : colors.controlsSecondary,
              }}
            >
              <BoldP>FUNNY</BoldP>
            </div>

            <div
              onClick={() => setLevel(1)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "12px 20px",
                border: `1px solid ${level === 1 ? colors.blackPrimary : colors.border}`,
                background: level === 1 ? colors.elevation1 : colors.controlsSecondary,
                gap: 8,
              }}
            >
              <BoldP>NEUTRAL</BoldP>
            </div>
            <div
              onClick={() => setLevel(2)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: "12px 20px",
                borderRadius: "0 16px 16px 0",
                border: `1px solid ${level === 2 ? colors.blackPrimary : colors.border}`,
                background: level === 2 ? colors.elevation1 : colors.controlsSecondary,
              }}
            >
              <BoldP>STUFFY</BoldP>
            </div>
          </div>
        </Fieild>
      </GroupField>

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
            <BoldP style={{ fontSize: 24, marginTop: -2 }}>{">"}</BoldP>
          </div>

          <NumberInput value={ifResultAmount} onChange={(e) => setResultAmount(formatNumber(e.target.value))} />
        </div>

        <div
          style={{
            maxWidth: "100%",
            overflowX: "auto",
            width: "fit-content",
            display: "flex",
            border: `1px solid ${colors.borderHight}`,
            height: 46,
            borderRadius: 16,
            background: colors.controlsSecondary,
          }}
        >
          <div style={{ padding: "12px 14px", borderRight: `1px solid ${colors.border}` }}>
            <BoldP style={{ whiteSpace: "nowrap", color: colors.blackSecondary }}>SEND{selectedToken ? ` ${selectedToken.symbol}` : ""}</BoldP>
          </div>
          <div style={{ padding: "12px 12px", borderRight: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <img src={chatgtpIcon} style={{ width: 32, height: 32, marginLeft: -4 }} />
            <BoldP>RESULT</BoldP>
          </div>
          <div style={{ padding: "12px 16px", borderRight: `1px solid ${colors.border}` }}>
            <BoldP style={{ color: colors.blackSecondary }}>TO</BoldP>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <BoldP style={{ whiteSpace: "nowrap" }}>ADDRESS FROM TWEET</BoldP>
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
  padding: 0 24px 24px;
  gap: 24px;

  @media (max-width: 800px) {
    margin: 32px auto;
    gap: 16px;
  }
`;

const NumberInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  padding: 12px 14px;

  font-family: "Inter";
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  color: ${colors.blackPrimary};
  text-decoration: none;
  width: 100px;
  margin: 0;
`;

const Fieild = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupField = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 800px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export default observer(CreateDao);
