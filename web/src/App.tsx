import { observer } from "mobx-react-lite";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Home";
import Create from "./Create";
import Header from "./Header";
import { WalletProvider } from "./WalletProvider";
import HowItWorks from "./HowItWorks";
import DAO from "./DAO";
import PopupsProvider from "@uikit/Popup";

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
            <Route path="/dao/:id" element={<DAO />} />
            <Route path="/about" element={<HowItWorks />} />
          </Routes>
        </>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default observer(App);
