import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { useClient } from "wagmi";

import { H2, SmallText, Text } from "@uikit/typographic";
import { useEthersSigner } from "./useEtherProvider";
import { DAO_ABI } from "./contract";
import HereInput from "@uikit/Input";
import { ActionButton } from "@uikit/button";
import uuid4 from "uuid4";
import { colors } from "@uikit/theme";
import Icon from "@uikit/Icon";
import { ManifestDAO } from "./Create";

const TEE = "0xc0c9Da9ca9712eeb438Ec9AbAcAB6F68cE531aC3";

const DAO = () => {
  const { id } = useParams();
  const client = useClient();

  const [manifest, setManifest] = useState<ManifestDAO>();
  const etherClient = useEthersSigner();

  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [uuid, setUuid] = useState("0");
  const [messages, setMessages] = useState<
    {
      id: string;
      publicKey?: string;
      response?: string;
      request?: string;
      signature?: string;
    }[]
  >([]);

  const callDAO = async () => {
    if (!etherClient) return;
    const uuid = uuid4();
    setUuid(uuid);

    setLoading(true);
    const xmtp = await Client.create(etherClient, { env: "production" });
    const conversation = await xmtp.conversations.newConversation(TEE);
    await conversation?.send(JSON.stringify({ dao_address: id, tweet_id: tweet, id: uuid }));

    const list = await conversation.messages();
    const isSender = (t: DecodedMessage<string | undefined>) => t.senderAddress.toLowerCase() !== etherClient.address.toLowerCase();
    const parseMessage = (t: DecodedMessage<string | undefined>) => {
      try {
        return JSON.parse(t.content!);
      } catch {
        return {};
      }
    };

    setMessages(list.filter(isSender).map(parseMessage));
    for await (const message of await conversation.streamMessages()) {
      console.log(message);
      if (!isSender(message)) continue;
      setMessages((t) => [...t, parseMessage(message)]);
    }
  };

  const requestMessages = messages.filter((t) => t.id === uuid);
  const chatgptRequest = requestMessages.find((t) => t.request != null);
  const chatgptResponse = requestMessages.find((t) => t.response != null);
  const answer = [chatgptRequest?.request, chatgptResponse?.response].filter((t) => t != null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const hash = await readContract(client!, { abi: DAO_ABI, functionName: "manifest", address: id as any });
      const manifest = await fetch(`https://ipfs.hotdao.ai/ipfs/${hash}`).then((r) => r.json());
      setManifest(manifest);
    };

    load();
  }, []);

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

      {answer.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          <SmallText>DAO ANSWER</SmallText>
          {answer.map((t, i) => (
            <Card key={i}>
              <Text>{t}</Text>
            </Card>
          ))}
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
  padding: 24px;
  gap: 24px;
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
