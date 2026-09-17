import { View } from "react-native";
import { Colors } from "../../theme/colors";

export default function PaginationDots({ currentIndex, total }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 35,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={{
            width: index === currentIndex ? 22 : 8,
            height: 8,
            borderRadius: 10,
            marginHorizontal: 4,
            backgroundColor:
              index === currentIndex ? Colors.primary : "#D1D5DB",
          }}
        />
      ))}
    </View>
  );
}
