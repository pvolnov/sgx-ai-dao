import { Component } from "react";

import sun from "./icons/sun.svg?react";
import lighter from "./icons/lighter.svg?react";
import daoBox from "./icons/box-sharp.svg?react";
import daoUpload from "./icons/upload-sharp.svg?react";
import daoShare from "./icons/share-sharp.svg?react";
import daoSparkles from "./icons/nouns-sparkles-sharp.svg?react";

export const icons = {
  dao_box: daoBox,
  dao_star: daoSparkles,
  dao_upload: daoUpload,
  dao_share: daoShare,
  sun,
  lighter,
};

interface Props extends React.SVGAttributes<SVGElement> {
  name: keyof typeof icons;
}

class Icon extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { name, ...props } = this.props;
    const Icon = icons[name];
    if (Icon == null) return null;
    if (typeof Icon === "string") return <img {...(props as any)} src={Icon} />;
    return <Icon {...props} />;
  }
}

export default Icon;
