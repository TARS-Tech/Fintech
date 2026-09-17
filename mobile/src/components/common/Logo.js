import { Colors } from "../../theme/colors";
import { LineHeight } from "../../theme/typography";
import AppText from "./AppText";

export default function Logo({ size }) {
  return (
    <AppText
      weight="bold"
      color={Colors.primary}
      style={{ fontSize: size, lineHeight: 30 }}
    >
      Finpilot
    </AppText>
  );
}
