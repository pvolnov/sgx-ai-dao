import { observer } from "mobx-react-lite";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Home";
import Create from "./Create";
import Header from "./Header";
import { WalletProvider } from "./WalletProvider";
import HowItWorks from "./HowItWorks";
import DAO from "./DAO";
import PopupsProvider from "@uikit/Popup";
import { SmallText } from "@uikit/typographic";
import intelSgx from "./assets/intel.png";
import xmtpIcon from "./assets/xmtp.png";

import { colors } from "@uikit/theme";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <>
          <Header />
          <PopupsProvider />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/dao/:chain/:id" element={<DAO />} />
            <Route path="/about" element={<HowItWorks />} />
            <Route path="*" element={<Home />} />
          </Routes>

          <a
            target="_blank"
            href="https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/attestation-services.html"
            style={{
              textDecoration: "none",
              background: colors.elevation0,
              borderRadius: 12,
              opacity: 0.8,
              display: "flex",
              alignItems: "center",
              gap: 8,
              position: "fixed",
              bottom: 12,
              right: 12,
              padding: "4px 8px",
            }}
          >
            <SmallText style={{ textDecoration: "none", color: colors.blackPrimary }}>Secured by Intel SGX</SmallText>
            <img src={intelSgx} style={{ width: 24, height: 24 }} />
          </a>

          <a
            target="_blank"
            href="https://xmtp.org/"
            style={{
              textDecoration: "none",
              background: colors.elevation0,
              borderRadius: 12,
              opacity: 0.8,
              display: "flex",
              alignItems: "center",
              gap: 4,
              position: "fixed",
              bottom: 48,
              right: 12,
              padding: "4px 8px",
            }}
          >
            <SmallText style={{ textDecoration: "none", color: colors.blackPrimary }}>Powered with</SmallText>
            <img src={xmtpIcon} style={{ height: 16, opacity: 0.8 }} />
          </a>
        </>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default observer(App);
