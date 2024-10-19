import { observer } from "mobx-react-lite";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Home";
import Create from "./Create";
import Header from "./Header";
import { WalletProvider } from "./WalletProvider";
import DAO from "./DAO";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/dao/:id" element={<DAO />} />
          </Routes>
        </>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default observer(App);
