import styled from "styled-components";
import { colors } from "./theme";

export const H2 = styled.h2`
  font-family: var(--headline-font);
  font-style: normal;
  font-weight: 900;
  font-size: 32px;
  line-height: 40px;
  color: ${colors.blackPrimary};
  margin: 0;
`;

export const H3 = styled.h3`
  font-family: var(--headline-font);
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 30px;
  color: ${colors.blackPrimary};
  margin: 0;
`;

export const H4 = styled.h4`
  font-family: var(--headline-font);
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  line-height: 25px;
  color: ${colors.blackPrimary};
  margin: 0;
`;

export const Text = styled.p`
  font-family: "SFRounded";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: ${colors.blackPrimary};
  margin: 0;
  text-decoration: none;
`;

export const LargeP = styled(Text)`
  font-size: 18px;
`;

export const BoldP = styled(Text)`
  font-weight: 600;
`;

export const SmallText = styled.p`
  font-family: "SFRounded";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${colors.blackSecondary};
  margin: 0;
`;

export const SmallTextBold = styled(SmallText)`
  font-weight: 600;
`;

export const TinyText = styled(SmallText)`
  font-size: 12px;
  line-height: 12px;
`;

export const H1 = styled.h1`
  font-family: var(--headline-font);
  font-style: normal;
  font-weight: 900;
  font-size: 40px;
  line-height: 42px;
  color: ${colors.blackPrimary};
  margin: 0;
`;

export const H0 = styled.h1`
  font-family: var(--headline-font);
  font-style: normal;
  font-weight: 900;
  font-size: 64px;
  line-height: 79px;
  color: ${colors.blackPrimary};
  margin: 0;
`;
