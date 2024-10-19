import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import uuid4 from "uuid4";

import HereInput from "@uikit/Input";
import { H2, SmallText, Text } from "@uikit/typographic";
import { ActionButton } from "@uikit/button";
import { colors } from "@uikit/theme";
import { ManifestDAO } from "./Create";
import Icon from "@uikit/Icon";

import { notify } from "./toast";
import { DAO_ABI, TEE } from "./contract";
import { useEthersSigner } from "./useEtherProvider";
import chatgtpIcon from "./assets/chatgpt.png";

const DAO = () => {
  const { id } = useParams();
  const [manifest, setManifest] = useState<ManifestDAO>();
  const etherClient = useEthersSigner();

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
          if (!isSender(message)) continue;
          const msg = parseMessage(message);
          if (msg.id === uuid) return msg;
        }
      };

      const parts = tweet.trim().split("/");
      const tweetId = parts.reverse().find((t) => !isNaN(+t));
      if (tweetId == null) throw "Invalid tweet link";

      await conversation?.send(JSON.stringify({ dao_address: id, tweet_id: tweetId, id: uuid }));
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
    } catch (e) {
      notify(e);
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!etherClient || !id) return;
      const contract = new ethers.Contract(id!, DAO_ABI, etherClient!);
      const hash = await contract.manifest();
      const manifest = await fetch(`https://ipfs.hotdao.ai/ipfs/${hash}`).then((r) => r.json());
      setManifest(manifest);
    };

    load();
  }, [etherClient]);

  return (
    <Root>
      <div>
        <SmallText>DAO NAME</SmallText>
        {manifest ? <H2>{manifest?.name}</H2> : <Skeleton />}
      </div>

      <Fieild>
        <SmallText>DAO MANIFEST</SmallText>
        <Card style={{ height: 180, overflowY: "auto" }}>
          <Text>{manifest?.manifests[0]?.prompt}</Text>
        </Card>
      </Fieild>

      <Fieild>
        <SmallText>YOUR TWEET</SmallText>
        <HereInput value={tweet} onChange={(e) => setTweet(e.target.value)} label="Enter your tweet" />
      </Fieild>

      <ActionButton isLoading={isLoading} style={{ gap: 12 }} onClick={() => callDAO()}>
        CALL DAO <Icon color={colors.elevation0} name="rocket" />
      </ActionButton>

      {daoResult != null && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 16 }}>
          <Fieild>
            <SmallText>DAO REQUEST</SmallText>
            <Card>
              <Text>{daoResult.request}</Text>
            </Card>
          </Fieild>

          <Fieild>
            <SmallText>DAO ANSWER</SmallText>
            <Card style={{ position: "relative" }}>
              <Text>{daoResult.response}</Text>
              <img src={chatgtpIcon} style={{ width: 32, height: 32, position: "absolute", top: 8, right: 8 }} />
            </Card>
          </Fieild>

          <ActionButton isLoading={isClaiming} onClick={() => makeTx()}>
            Claim
          </ActionButton>
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
