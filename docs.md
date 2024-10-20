# MAO - Machine Autonomous Organization ![alt text](media/image-1.png)

**The service to create machine-controlled Smart Contracts.** These organizations are managed autonomously and transparently—without any human interference!

At the core of MAO lies the integration of advanced security and cryptographic technologies, granting AI unconditional control over users' funds.

![](media/terminator-terminator-robot-ezgif.com-video-to-gif-converter.gif)


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

![alt text](media/blockchain-fintech-ezgif.com-video-to-gif-converter.gif)

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

```
Immutable Manifest on IPFS + Tweets + Onchain Data

↓ 

ChatGPT 

↓ ↑ [TSL P2P Encryption] 

Intel SGX (Software Guard Extensions) 

↓ [XMTP P2P Encryption] 

Signed Transaction 

↓

MAO Smart Contract → Buy / Sell / Send
```

--- 

This innovative approach represents the next step toward decentralized, machine-managed organizations, ensuring autonomy and trust in the digital age.