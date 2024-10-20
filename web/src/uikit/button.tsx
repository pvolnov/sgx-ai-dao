import styled, { css } from "styled-components";
import { ActivityIndicator } from "./ActivityIndicator";
import { colors } from "./theme";

export const SButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${(p) => (p.$active ? colors.elevation0 : "")};
  transition: 0.2s opacity;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`;

export const SActionButton = styled.button<{ $big?: boolean; $stroke?: boolean }>`
  color: ${colors.elevation0};
  border: none;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  background: ${colors.blackPrimary};
  flex-shrink: 0;
  width: 100%;
  height: 56px;
  cursor: pointer;
  box-sizing: border-box;
  white-space: pre;

  font-family: "SFRounded";
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  padding: 0 16px;
  overflow: hidden;

  display: flex;
  font-weight: 600;
  border-radius: 24px;
  transition: 0.2s opacity, 0.2s background, 0.2s color;

  &:disabled {
    cursor: default;
    opacity: 1;
    background: ${colors.disableButton};
    color: ${colors.iconSecondary};

    svg {
      filter: grayscale(1);
    }
  }

  ${(p) =>
    p.$big &&
    css`
      border-radius: 32px;
      height: 80px;
    `}

  ${(p) =>
    p.$stroke &&
    css`
      background: transparent;
      border: 1px solid ${colors.border};
      color: ${colors.blackPrimary};
    `}
`;

export const SStrokeButton = styled(SActionButton)`
  background: transparent;
  border: 2px solid ${colors.blackPrimary};
  color: ${colors.blackPrimary};
`;

export const SLinkButton = styled.button`
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;

  font-family: "SFRounded";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-decoration-line: underline;
  color: ${colors.pink};
`;

export const SHereButton = styled.button`
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  gap: 8px;

  height: 46px;
  background: ${colors.tertiary_3};
  cursor: pointer;

  border: 1px solid ${colors.borderHight};
  box-shadow: 4px 4px 0px ${colors.controlsDarkDark}, 4px 4px 0px 1px ${colors.shadowStroke};
  border-radius: 16px;

  transition: 0.2s box-shadow, 0.2s transform;

  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;

  font-family: "SFRounded";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: ${colors.darkDark};
  text-decoration: none;

  &.pressed {
    box-shadow: 0 0 0 ${colors.darkDark};
    transform: translate(4px, 4px);
  }

  &:disabled {
    cursor: default;
    background: ${colors.disableButton} !important;
    border: 1px solid #6b6661;
    box-shadow: 4px 4px 0px #6b6661;
    pointer-events: none;
  }
`;

type ButtonProps = React.HTMLProps<HTMLButtonElement> & { $id?: string };

export const Button = (p: ButtonProps & { $active?: boolean }) => {
  return (
    <SButton
      {...(p as any)}
      onClick={(e: any) => {
        //  AnalyticsTracker.shared.track("button:" + p.$id);
        p.onClick?.(e);
      }}
    />
  );
};

export const ActionButton = ({ isLoading, stroke, big, ...p }: ButtonProps & { big?: boolean; stroke?: boolean; isLoading?: boolean }) => {
  return (
    <SActionButton
      {...(p as any)}
      $stroke={stroke}
      $big={big}
      children={isLoading ? <ActivityIndicator /> : p.children}
      disabled={p.disabled || isLoading}
      onClick={(e: any) => {
        // AnalyticsTracker.shared.track("button:" + p.$id);
        p.onClick?.(e);
      }}
    />
  );
};

export const StrokeButton = (p: ButtonProps) => {
  return (
    <SStrokeButton
      {...(p as any)}
      onClick={(e: any) => {
        // AnalyticsTracker.shared.track("button:" + p.$id);
        p.onClick?.(e);
      }}
    />
  );
};

export const LinkButton = (p: ButtonProps) => {
  return (
    <SLinkButton
      {...(p as any)}
      onClick={(e: any) => {
        //  AnalyticsTracker.shared.track("button:" + p.$id);
        p.onClick?.(e);
      }}
    />
  );
};

export const HereButton = ({ isLoading, ...p }: ButtonProps & { $id?: string; isLoading?: boolean }) => {
  return (
    <SHereButton
      {...(p as any)}
      onPointerDown={(e) => e.currentTarget.classList.add("pressed")}
      onPointerOver={(e) => e.currentTarget.classList.remove("pressed")}
      onPointerUp={(e) => e.currentTarget.classList.remove("pressed")}
      onPointerCancel={(e) => e.currentTarget.classList.remove("pressed")}
      onPointerLeave={(e) => e.currentTarget.classList.remove("pressed")}
      children={isLoading ? <ActivityIndicator /> : p.children}
      onClick={(e: any) => {
        if (isLoading) return;
        //  AnalyticsTracker.shared.track("button:" + p.$id);
        p.onClick?.(e);
      }}
    />
  );
};

export const ChainButton = styled.div`
  border-radius: 12px;
  border: 1px solid ${colors.blackPrimary};
  background: ${colors.elevation0};
  display: flex;
  padding: 4px;
  padding-right: 8px;
  align-items: center;
  gap: 8px;
`;
