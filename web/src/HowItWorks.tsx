import MarkdownPreview from "@uiw/react-markdown-preview";
import styled from "styled-components";
import { colors } from "@uikit/theme";

const source = `
# MAO - Machine Autonomous Organization

**The service to create machine-controlled Smart Contracts.** These organizations are managed autonomously and transparently—without any human interference!

At the core of MAO lies the integration of advanced security and cryptographic technologies, granting AI unconditional control over users' funds.

![MAO in Action](https://storage.herewallet.app/upload/f61a560f6b84ba40cb447554125dd69ca852fe206a51616940a278c857961b8c.gif)

---

## **How Does the Machine Control Funds?**

MAO is built around **Intel SGX (Software Guard Extensions)** technology. These specialized chips run immutable code in a secure, isolated environment and are capable of generating cryptographic signatures.

On **October 19, 2024**, the first instance—**"MAO One"**—was deployed within an SGX chip. This instance guarantees the secure operation of all MAO systems.

The process begins when **MAO One** listens for anonymous messages via the **XMTP protocol**. Upon receiving a request, the message is forwarded to the **central controller—ChatGPT**. Communications between MAO One and ChatGPT servers are encrypted using pre-configured **TSL certificates**, ensuring that no third party can interfere.

If the controller authorizes a transaction, **MAO One** signs it with its private key and sends the signed transaction back to the user via XMTP. The user can then execute the transaction on a blockchain.

---

## **How MAO Interacts with the Outside World**

To obtain real-world information, MAO One relies on **X.com** (formerly Twitter)—the most open social platform supporting free speech. Users can submit a tweet from an account (whether personal, organizational, or governmental) to verify real-world events.

For example, users could submit an election result tweet from the **@POTUS** account to confirm the outcome. This enables MAO to respond to real-world events promptly and support community members efficiently.

---

## **Handling On-Chain Data for Decision Making**

MAO One can fetch on-chain data from **TheGraph** via a secure TSL channel. This enables ChatGPT to access essential blockchain information, such as token balances, prices, holders, and transaction volumes. This data allows MAO to make informed decisions based on current blockchain states.

Thanks to Intel SGX technology, the **"MAO One" code is immutable** and cannot be altered. All MAOs built on this platform operate exclusively through ChatGPT.

![MAO in Action](https://storage.herewallet.app/upload/b220213367deb805ea9656585c05cee2faacb1b531d96a0e451dd669f0c2b1f3.gif)

---

## **Governance through the Manifest**

Every government has its laws to guide decisions, and in MAO, these laws are captured in the **Manifest**—the organization’s core document. The Manifest defines:

- The data sources used for decisions.
- The rules by which decisions are made.
- The token governed by MAO.
- Scenarios in which the token is bought, sold, or sent to users.

---

## **Create Your Own MAO**

You can create your own MAO via the following link:  
[https://agi-dao.uwon.lol/dao/0x517649a2a1ac48613E0a4F3309A22D8611364108](https://agi-dao.uwon.lol/dao/0x517649a2a1ac48613E0a4F3309A22D8611364108)

---

## **MAO Workflow Diagram**

\`\`\`
Immutable Manifest on IPFS + Tweets + Onchain Data

↓

ChatGPT

↓ ↑ [TSL P2P Encryption]

Intel SGX (Software Guard Extensions)

↓ [XMTP P2P Encryption]

Signed Transaction

↓

MAO Smart Contract → Buy / Sell / Send
\`\`\`

---

This innovative approach represents the next step toward decentralized, machine-managed organizations, ensuring autonomy and trust in the digital age.
`;

export default function Demo() {
  return (
    <Root>
      <MarkdownPreview
        source={source}
        wrapperElement={{
          "data-color-mode": "dark",
        }}
      />
    </Root>
  );
}

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

  div {
    background-color: transparent;
  }

  .wmde-markdown h2 {
    border-bottom: 1px solid ${colors.border};
  }

  .wmde-markdown hr {
    border-bottom: 1px solid ${colors.border};
    background-color: ${colors.border};
  }

  * {
    font-size: Inter;
    color: ${colors.blackPrimary};
  }
`;
