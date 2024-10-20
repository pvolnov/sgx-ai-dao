import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { ethers, formatUnits } from "ethers";
import { readContract } from "viem/actions";
import { useWalletClient } from "wagmi";
import { base } from "viem/chains";
import uuid4 from "uuid4";

import ConfettiExplosion from "react-confetti-explosion";

import HereInput from "@uikit/Input";
import { BoldP, H2, SmallText, Text } from "@uikit/typographic";
import { ActionButton } from "@uikit/button";
import { colors } from "@uikit/theme";
import { ManifestDAO } from "./Create";
import Icon from "@uikit/Icon";

import { notify } from "./toast";
import { DAO_ABI, ERC20_ABI, TEE } from "./contract";
import { useEthersSigner } from "./useEtherProvider";
import chatgtpIcon from "./assets/chatgpt.png";
import copyTextToClipboard from "./helpers";

const DAO = () => {
  const { chain, id } = useParams();
  const { data: client } = useWalletClient();
  const [manifest, setManifest] = useState<{
    manifest: ManifestDAO;
    dao: string;
    balance: bigint;
    token: string;
    symbol: string;
    decimal: number;
  }>();

  const etherClient = useEthersSigner(+(chain || 1));

  const [isSuccess, setSuccess] = useState(false);
  const [isClaiming, setClaiming] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [daoResult, setResult] = useState<{
    id: string;
    address: string;
    amount: string;
    requestHash: string;
    publicKey?: string;
    response: string;
    request: string;
    error: string;
    signature: string;
  }>();

  const callDAO = async () => {
    try {
      if (!etherClient) return;
      setLoading(true);
      const uuid = uuid4();
      const xmtp = await Client.create(etherClient, { env: "production" });
      const conversation = await xmtp.conversations.newConversation(TEE);

      const waitMessage = async () => {
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
          if (msg.id === uuid) return msg;
        }
      };

      const parts = tweet.trim().split("/");
      const tweetId = parts.reverse().find((t) => !isNaN(+t));
      if (tweetId == null) throw "Invalid tweet link";

      console.log({ dao_address: `${base.id}:${id}`, tweet_id: tweetId, id: uuid });
      await conversation?.send(JSON.stringify({ dao_address: `${base.id}:${id}`, tweet_id: tweetId, id: uuid }));
      const msg = await waitMessage();
      setLoading(false);
      setResult(msg);
    } catch (e) {
      setLoading(false);
      notify(e);
    }
  };

  const makeTx = async () => {
    try {
      if (!daoResult) return;
      setClaiming(true);
      const { address, amount, requestHash, signature } = daoResult;
      const contract = new ethers.Contract(id!, DAO_ABI, etherClient!);
      const tx = await contract.send(address, amount, requestHash, signature);
      const receipt = await tx.wait();
      console.log({ receipt });
      setSuccess(true);
    } catch (e) {
      notify(e);
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!etherClient || !client || !id) return;

      const [hash, token] = await Promise.all([
        readContract(client, { abi: DAO_ABI, functionName: "manifest", address: id as any }),
        readContract(client, { abi: DAO_ABI, functionName: "tokenAddress", address: id as any }),
      ]);

      const [balance, symbol, decimal] = await Promise.all([
        readContract(client, { abi: ERC20_ABI, functionName: "balanceOf", address: token as any, args: [id] }),
        readContract(client, { abi: ERC20_ABI, functionName: "symbol", address: token as any }),
        readContract(client, { abi: ERC20_ABI, functionName: "decimals", address: token as any }),
      ]);

      const manifest = await fetch(`https://ipfs.hotdao.ai/ipfs/${hash}`).then((r) => r.json());
      setManifest({ dao: id, manifest, balance, token, symbol, decimal } as any);
    };

    load();
  }, [etherClient]);

  return (
    <Root>
      {isSuccess && (
        <>
          <div style={{ position: "fixed", width: 5, height: 5, left: "0", top: "0", pointerEvents: "none" }}>
            <ConfettiExplosion
              onComplete={() => {
                setSuccess(false);
                setResult(undefined);
                setLoading(false);
                setClaiming(false);
              }}
              {...{
                force: 0.8,
                duration: 3000,
                particleCount: 250,
                width: window.innerWidth,
              }}
            />
          </div>

          <div style={{ position: "fixed", width: 5, height: 5, right: "0", top: "0", pointerEvents: "none" }}>
            <ConfettiExplosion
              onComplete={() => {
                setSuccess(false);
                setResult(undefined);
                setLoading(false);
                setClaiming(false);
              }}
              {...{
                force: 0.8,
                duration: 3000,
                particleCount: 250,
                width: window.innerWidth,
              }}
            />
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <SmallText>MAO NAME</SmallText>
          {manifest ? (
            <H2>
              {manifest?.manifest.name}{" "}
              <Icon
                style={{ cursor: "pointer", height: 40, marginBottom: -8, marginLeft: 8 }}
                color={colors.blackPrimary}
                name="dao_share"
                onClick={() => {
                  copyTextToClipboard(window.location.href);
                  notify("MAO link copied");
                }}
              />
            </H2>
          ) : (
            <Skeleton />
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <SmallText>MAO BALANCE</SmallText>
          {manifest ? (
            <div style={{ height: 34, marginTop: 6, display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", textAlign: "right" }}>
              <img style={{ width: 24, height: 24, borderRadius: "50%" }} src={`https://storage.herewallet.app/ft/${manifest.token.toLowerCase()}.png`} />
              <BoldP>
                {formatUnits(manifest.balance, manifest.decimal)} {manifest.symbol}
              </BoldP>
            </div>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>

      <Fieild>
        <SmallText>DAO MANIFEST</SmallText>
        <Card style={{ height: 180, overflowY: "auto" }}>
          <Text>{manifest?.manifest?.manifests[0]?.prompt}</Text>
        </Card>
      </Fieild>

      <Fieild>
        <SmallText>YOUR TWEET</SmallText>
        <HereInput value={tweet} onChange={(e) => setTweet(e.target.value)} label="Enter your tweet" />
      </Fieild>

      <ActionButton isLoading={isLoading} style={{ gap: 4 }} onClick={() => callDAO()}>
        CALL DAO <Icon color={colors.elevation0} name="dao_star" />
      </ActionButton>

      {daoResult != null && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 16 }}>
          {daoResult.request != null && (
            <Fieild>
              <SmallText>DAO REQUEST</SmallText>
              <Card>
                <Text>{daoResult.request}</Text>
              </Card>
            </Fieild>
          )}

          {daoResult.response != null && (
            <Fieild>
              <SmallText>DAO ANSWER</SmallText>
              <Card style={{ position: "relative" }}>
                <Text>{daoResult.response}</Text>
                <img src={chatgtpIcon} style={{ width: 32, height: 32, position: "absolute", top: 8, right: 8 }} />
              </Card>
            </Fieild>
          )}

          {daoResult.error != null && (
            <Fieild>
              <SmallText>DAO ERROR</SmallText>
              <Card>
                <Text>{daoResult.error}</Text>
              </Card>
            </Fieild>
          )}

          {daoResult.signature != null && (
            <ActionButton style={{ gap: 4 }} isLoading={isClaiming} onClick={() => makeTx()}>
              Claim
              <Icon color={colors.elevation0} name="dao_box" />
            </ActionButton>
          )}
        </div>
      )}
    </Root>
  );
};

const Fieild = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

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

const Card = styled.div`
  background: ${colors.controlsSecondary};
  border-radius: 16px;
  border: 1px solid ${colors.border};
  padding: 16px;
  p {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
`;

const Skeleton = styled.div`
  background: ${colors.controlsSecondary};
  border-radius: 16px;
  height: 40px;
  width: 300px;
`;

export default observer(DAO);
