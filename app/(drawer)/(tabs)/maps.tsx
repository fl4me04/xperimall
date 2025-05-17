import { Navbar } from "@/components/Navbar";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Image, Dimensions, ActivityIndicator } from "react-native";
import {
  Adapt,
  Button,
  FontSizeTokens,
  getFontSize,
  Label,
  Select,
  SelectProps,
  Sheet,
  SizableText,
  XStack,
  YStack,
  Spinner,
} from "tamagui";
import { SafeAreaView as SafeAreaViewContext } from "react-native-safe-area-context";

interface Floor {
  id: number;
  name: string;
  imageURL: string;
}

interface Activity {
  id: number;
  name: string;
  priceMin: number;
  priceMax: number;
  category: {
    id: number;
    name: string;
  };
  floor: {
    id: number;
    name: string;
    imageURL: string;
  };
}


export default function TabTwoScreen() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching floors...");
      const response = await fetch('https://xperimall-backend.onrender.com/api/floors');
      const data = await response.json();
      console.log("Floors data:", data);
      const mappedFloors = data.map((f: any) => ({
        id: f.ID,
        name: f.Name,
        imageURL: f.ImageURL
      }));
      setFloors(mappedFloors);
      if (mappedFloors.length > 0) {
        setSelectedFloor(mappedFloors[0]);
        await fetchActivitiesByFloor(mappedFloors[0].id);
      }
    } catch (error) {
      console.error('Error fetching floors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivitiesByFloor = async (floorId: number) => {
    try {
      setIsLoading(true);
      console.log("Fetching activities for floor:", floorId);
      const response = await fetch(`https://xperimall-backend.onrender.com/api/floors/${floorId}/activities`);
      const data = await response.json();
      console.log("Activities data:", data);
      const mappedActivities = data.map((a: any) => ({
        id: a.ID,
        name: a.Name,
        priceMin: a.PriceMin,
        priceMax: a.PriceMax,
        category: a.Category ? {
          id: a.Category.ID,
          name: a.Category.Name
        } : undefined,
        floor: a.Floor ? {
          id: a.Floor.ID,
          name: a.Floor.Name,
          imageURL: a.Floor.ImageURL
        } : undefined
      }));
      setActivities(mappedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFloorChange = (floorId: number) => {
    const floor = floors.find(f => f.id === floorId);
    if (floor) {
      setSelectedFloor(floor);
      fetchActivitiesByFloor(floorId);
    }
  };

  return (
    <SafeAreaViewContext style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Navbar />
        <YStack width={"auto"} height={"auto"} padding={28} space={5} paddingBottom={2} backgroundColor="#fff">
          <XStack
            alignItems="center"
            position="relative"
            justifyContent="center"
            height={50}
            marginBottom={10}
          >
            <Button
              circular
              size="$2"
              background="#9BA88D"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)")}
              style={{
                position: "absolute",
                left: 0,
                backgroundColor: "#9BA88D",
                borderWidth: 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
            <SizableText
              style={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: 28,
                color: "#9BA88D",
                letterSpacing: 1,
                alignSelf: "center",
              }}
            >
              Mall Map
            </SizableText>
          </XStack>
          {isLoading ? (
            <YStack flex={1} justifyContent="center" alignItems="center" padding={20}>
              <Spinner size="large" color="#9BA88D" />
              <SizableText style={{ marginTop: 10, color: "#9BA88D" }}>Loading...</SizableText>
            </YStack>
          ) : (
            <>
              <YStack alignItems="center" justifyContent="center" space={4}>
                {selectedFloor && (
                  <Image
                    source={floorImageMap[selectedFloor.name]}
                    style={{
                      width: screenWidth * 0.9,
                      height: screenWidth * 0.9 * 0.75,
                      resizeMode: "contain",
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: "#D6D6C2",
                      backgroundColor: "#fff",
                      marginBottom: 10,
                    }}
                  />
                )}
                <XStack width={"100%"} gap="$4" justifyContent="center" marginBottom={10}>
                  <SelectDemoItem
                    id="select-demo-1"
                    floors={floors}
                    selectedFloorId={selectedFloor?.id}
                    onFloorChange={handleFloorChange}
                  />
                </XStack>
              </YStack>
              <YStack marginTop={10}>
                <SizableText style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 20, color: "#9BA88D", marginBottom: 10 }}>
                  Activities
                </SizableText>
                {activities.length === 0 && (
                  <SizableText style={{ fontFamily: "Poppins", color: "#5A5A4D", textAlign: "center", padding: 20, backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#D6D6C2" }}>
                    Tidak ada activity di lantai ini.
                  </SizableText>
                )}
                {activities.map((activity) => (
                  <XStack
                    key={activity.id}
                    justifyContent="center"
                    alignItems="center"
                    alignSelf="center"
                    style={{
                      borderRadius: 12,
                      backgroundColor: "#9BA88D",
                      width: "95%",
                      marginBottom: 8,
                      marginVertical: 6,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#D6D6C2",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                    }}
                  >
                    <YStack flex={1}>
                      <SizableText style={{ fontFamily: "Poppins", fontWeight: "600", color: "#fff", fontSize: 16 }}>{activity.name}</SizableText>
                      <SizableText style={{ fontFamily: "Poppins", color: "#fff", fontSize: 13 }}>
                        Min: {activity.priceMin} | Max: {activity.priceMax}
                      </SizableText>
                      <SizableText style={{ fontFamily: "Poppins", color: "#fff", fontSize: 13 }}>
                        Category: {activity.category?.name}
                      </SizableText>
                    </YStack>
                  </XStack>
                ))}
              </YStack>
            </>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaViewContext>
  );
}

export function SelectDemoItem(
  props: SelectProps & { 
    floors: Floor[];
    selectedFloorId?: number;
    onFloorChange: (floorId: number) => void;
  }
) {
  const [val, setVal] = React.useState("");

  useEffect(() => {
    if (props.selectedFloorId !== undefined) {
      setVal(props.selectedFloorId.toString());
    }
  }, [props.selectedFloorId]);

  const handleValueChange = (value: string) => {
    setVal(value);
    props.onFloorChange(parseInt(value));
  };

  return (
    <Select
      value={val}
      onValueChange={handleValueChange}
      disablePreventBodyScroll
      {...props}
    >
      <Select.Trigger
        maxWidth={220}
        iconAfter={ChevronDown}
        style={{
          backgroundColor: "#F8F6E8",
          borderRadius: 25,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: "#D6D6C2",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Select.Value
          style={{
            color: "#5A5A4D",
            fontWeight: "600",
            fontSize: 16,
          }}
        />
      </Select.Trigger>

      <Select.Content zIndex={200000}>
        <Select.Viewport
          style={{
            padding: 10,
            backgroundColor: "#F8F6E8",
          }}
        >
          <Select.Group>
            <Select.Label
              style={{
                backgroundColor: "transparent",
                fontSize: 14,
                fontWeight: "600",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Select Floor
            </Select.Label>
            {props.floors
              ?.filter(floor => floor && typeof floor.id === "number")
              .map((floor, i) => (
                <Select.Item
                  index={i}
                  key={floor.id}
                  value={floor.id.toString()}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 15,
                    backgroundColor:
                      val === floor.id.toString() ? "#A7C4A0" : "transparent",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Select.ItemText
                    style={{
                      color: "#5A5A4D",
                      fontWeight: "500",
                    }}
                  >
                    {floor.name}
                  </Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} color="#5A5A4D" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
}

const floorImageMap: { [key: string]: any } = {
  "Lower Ground Floor": require('../../../assets/images/lowerGroundFloor.png'),
  "Lower Ground Mezzanine Floor": require('../../../assets/images/lowerGroundMezzanine.png'),
  "Ground Floor": require('../../../assets/images/groundFloor.png'),
  "Upper Ground Floor": require('../../../assets/images/upperGroundFloor.png'),
  "1st Floor": require('../../../assets/images/1stFloor.png'),
  "2nd Floor": require('../../../assets/images/2ndFloor.png'),
  "3rd Floor": require('../../../assets/images/3rdFloor.png'),
};