import { Text } from "react-native";
import { FontFamily, FontSize, LineHeight } from "../../theme/typography";

export default function AppText({
  children,
  weight = "regular",
  size = "md",
  style,
  color = "#111827",
  ...props
}) {
  return (
    <Text
      style={[
        {
          fontFamily: FontFamily[weight],
          fontSize: FontSize[size],
          lineHeight: LineHeight[size],
          color,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
