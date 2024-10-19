import { useLocation, useNavigate } from "react-router-dom";
import { useConnectors, useDisconnect, useReconnect, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "@uikit/theme";
import { Button } from "@uikit/button";
import { Text } from "@uikit/typographic";
import Icon from "@uikit/Icon";

const HeaderComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "dark");

  const { data: client } = useWalletClient();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { reconnect } = useReconnect();
  const connectors = useConnectors();

  useEffect(() => {
    reconnect();
  }, [connectors.length]);

  const toggleTheme = () => {
    setTheme((theme) => {
      const newTheme = theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      return newTheme;
    });
  };

  const connectWallet = async () => {
    disconnect();
    openConnectModal?.();
  };

  return (
    <Header>
      <NavBar style={{ margin: "auto" }}>
        <NavButton $active={location.pathname === "/"} onClick={() => navigate("/")}>
          <Text>Home</Text>
        </NavButton>

        <NavButton $active={location.pathname === "/create"} onClick={() => navigate("/create")}>
          <Text>Create DAO</Text>
        </NavButton>
      </NavBar>

      <div style={{ position: "absolute", right: 24, display: "flex", gap: 16 }}>
        <Button style={{ gap: 12, height: 42, background: colors.elevation1, padding: "12px 16px", borderRadius: 24, color: colors.blackPrimary }} onClick={() => connectWallet()}>
          {client ? (
            <Text>
              {client.account.address.slice(0, 6)}..{client.account.address.slice(-6)}
            </Text>
          ) : (
            <Text>Connect wallet</Text>
          )}
          <Icon name="wallet" />
        </Button>

        <Button onClick={() => toggleTheme()} style={{ gap: 12, height: 42, background: colors.elevation1, padding: "12px 16px", borderRadius: 24, color: colors.blackPrimary }}>
          <Icon name={theme === "dark" ? "sun" : "lighter"} />
        </Button>
      </div>
    </Header>
  );
};

export const Header = styled.div`
  background: ${colors.elevation0};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const NavBar = styled.div`
  display: flex;
  gap: 32px;
`;

export const NavButton = styled.button<{ $active?: boolean }>`
  outline: none;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  border: none;
  height: 68px;

  background-color: ${colors.elevation0};
  color: ${(p) => (p.$active ? colors.blackPrimary : colors.blackSecondary)};
  border-bottom: ${(p) => (p.$active ? `2px solid ${colors.blackPrimary}` : "")};

  transition: 0.2s color, 0.2s border-bottom;
  cursor: pointer;

  &:hover {
    color: ${colors.blackPrimary};
    border-bottom: 2px solid ${colors.blackSecondary};
  }
`;

export default observer(HeaderComponent);
