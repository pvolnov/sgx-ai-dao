import { useLocation, useNavigate } from "react-router-dom";
import { useConnectors, useReconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import styled from "styled-components";
import icon from "./assets/icon.png";

import { colors } from "@uikit/theme";
import { Button } from "@uikit/button";
import { BoldP } from "@uikit/typographic";
import Icon from "@uikit/Icon";

const HeaderComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "dark");
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

  return (
    <div style={{ background: colors.elevation0 }}>
      <Header>
        <img src={icon} style={{ width: 40, height: 40, marginRight: 32 }} />

        <NavBar>
          <NavButton $active={location.pathname === "/"} onClick={() => navigate("/")}>
            <BoldP>Home</BoldP>
          </NavButton>

          <NavButton $active={location.pathname === "/create"} onClick={() => navigate("/create")}>
            <BoldP>Create MAO</BoldP>
          </NavButton>

          <NavButton $active={location.pathname === "/about"} onClick={() => navigate("/about")}>
            <BoldP>How it works</BoldP>
          </NavButton>
        </NavBar>

        <SideButtons>
          {/* <Button style={{ gap: 12, height: 42, background: colors.elevation1, padding: "12px 12px", borderRadius: 24, color: colors.blackPrimary }} onClick={() => connectWallet()}>
          {client ? (
            <Text>
              {client.account.address.slice(0, 6)}..{client.account.address.slice(-6)}
            </Text>
          ) : (
            <Text>Connect wallet</Text>
          )}

          <Icon name="wallet" />
        </Button> */}

          <ConnectButton />

          <Button onClick={() => toggleTheme()} style={{ gap: 12, height: 42, background: colors.elevation1, padding: "12px 12px", borderRadius: 24, color: colors.blackPrimary }}>
            <Icon name={theme === "dark" ? "sun" : "lighter"} />
          </Button>
        </SideButtons>
      </Header>
    </div>
  );
};

export const Header = styled.div`
  background: ${colors.elevation0};
  max-width: 1200px;
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 62px;
  padding: 0 24px;

  @media (max-width: 980px) {
    justify-content: flex-start;
  }

  @media (max-width: 540px) {
    padding: 0 16px;
  }
`;

export const SideButtons = styled.div`
  position: absolute;
  right: 24px;
  display: flex;
  gap: 16px;

  @media (max-width: 540px) {
    right: 16px;
  }
`;

export const NavBar = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 540px) {
    display: none;
  }
`;

export const NavButton = styled.button<{ $active?: boolean }>`
  outline: none;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  border: none;
  height: 62px;

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
