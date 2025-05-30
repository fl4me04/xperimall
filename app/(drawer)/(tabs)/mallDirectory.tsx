import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ScrollView,
  SizableText,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { AntDesign } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

const { width, height } = Dimensions.get("window");

interface Floor {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Activity {
  id: number;
  name: string;
  priceMin: number;
  priceMax: number;
  category: Category;
}

interface CategoryWithActivities {
  category: Category;
  activities: Activity[];
}

export default function mallDirectory() {
  const { floorId } = useLocalSearchParams();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [categoriesWithActivities, setCategoriesWithActivities] = useState<CategoryWithActivities[]>([]);

  useEffect(() => {
    fetchFloors();
  }, []);

  useEffect(() => {
    if (floorId && floors.length > 0) {
      const floorIdNum = parseInt(floorId as string);
      const floor = floors.find(f => f.id === floorIdNum);
      if (floor) {
        setSelectedFloor(floor);
        fetchActivitiesByFloor(floorIdNum);
      }
    }
  }, [floorId, floors]);

  const fetchFloors = async () => {
    try {
      const response = await fetch("https://xperimall-backend.onrender.com/api/floors");
      const data = await response.json();
      const mappedFloors = data.map((f: any) => ({
        id: f.ID,
        name: f.Name,
      }));
      setFloors(mappedFloors);
      if (mappedFloors.length > 0 && !floorId) {
        setSelectedFloor(mappedFloors[0]);
        fetchActivitiesByFloor(mappedFloors[0].id);
      }
    } catch (error) {
      console.error("Error fetching floors:", error);
    }
  };

  const fetchActivitiesByFloor = async (floorId: number) => {
    try {
      const response = await fetch(
        `https://xperimall-backend.onrender.com/api/floors/${floorId}/activities`
      );
      const data = await response.json();
      
      // Group activities by category
      const activitiesByCategory = new Map<number, CategoryWithActivities>();
      
      data.forEach((activity: any) => {
        const categoryId = activity.Category.ID;
        if (!activitiesByCategory.has(categoryId)) {
          activitiesByCategory.set(categoryId, {
            category: {
              id: activity.Category.ID,
              name: activity.Category.Name,
            },
            activities: [],
          });
        }
        
        activitiesByCategory.get(categoryId)?.activities.push({
          id: activity.ID,
          name: activity.Name,
          priceMin: activity.PriceMin,
          priceMax: activity.PriceMax,
          category: {
            id: activity.Category.ID,
            name: activity.Category.Name,
          },
        });
      });
      
      setCategoriesWithActivities(Array.from(activitiesByCategory.values()));
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleFloorChange = (floorId: number) => {
    const floor = floors.find((f) => f.id === floorId);
    if (floor) {
      setSelectedFloor(floor);
      fetchActivitiesByFloor(floorId);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Navbar />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#fff",
          paddingTop: 100,
        }}
      >
        <YStack
          width={"auto"}
          height={"auto"}
          padding={width * 0.07}
          space={width * 0.03}
          paddingBottom={width * 0.01}
        >
          <XStack
            alignItems="center"
            position="relative"
            justifyContent="center"
            height={width * 0.115}
            marginBottom={width * 0.02}
          >
            <Button
              circular
              size="$2"
              background="#2B4433"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)")}
              style={{
                position: "absolute",
                left: 0,
                backgroundColor: "#2B4433",
                borderWidth: 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
            <XStack marginLeft={25}>
              <DropdownComponent floors={floors} selectedFloorId={selectedFloor?.id} onFloorChange={handleFloorChange} />
            </XStack>
          </XStack>

          {categoriesWithActivities.map((categoryData) => (
            <YStack key={categoryData.category.id} space={10} justifyContent="center">
              <XStack
                width={width * 0.5}
                style={{
                  backgroundColor: "#4A7C59",
                  padding: 7,
                  borderRadius: 20,
                  borderWidth: 1.4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SizableText
                  style={{ fontSize: 20, color: "#fff", fontWeight: "500" }}
                >
                  {categoryData.category.name}
                </SizableText>
              </XStack>
              <YStack space={5} padding={10} marginTop={-10}>
                {categoryData.activities.map((activity) => (
                  <SizableText
                    key={activity.id}
                    style={{
                      fontSize: 17,
                      fontFamily: "Poppins",
                      fontWeight: "500",
                      color: "#2B4433",
                    }}
                  >
                    • {activity.name} 
                  </SizableText>
                ))}
              </YStack>
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

interface DropdownComponentProps {
  floors: Floor[];
  selectedFloorId?: number;
  onFloorChange: (floorId: number) => void;
}

const DropdownComponent = ({ floors, selectedFloorId, onFloorChange }: DropdownComponentProps) => {
  const data = floors.map(floor => ({
    label: floor.name,
    value: floor.id.toString()
  }));

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select Floor"
      value={selectedFloorId?.toString()}
      onChange={(item) => {
        onFloorChange(parseInt(item.value));
      }}
      renderItem={(item) => (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {item.value === selectedFloorId?.toString() && (
            <AntDesign style={styles.icon} color="#4A7C59" name="check" size={18} />
          )}
        </View>
      )}
      activeColor="#F8F6E8"
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    width: width * 0.6,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D6D6C2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  item: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0E8",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#2B4433",
  },
  placeholderStyle: {
    fontSize: 20,
    fontFamily: "Poppins",
    color: "#2B4433",
    fontWeight: "600",
  },
  selectedTextStyle: {
    fontSize: 20,
    fontFamily: "Poppins",
    color: "#2B4433",
    fontWeight: "600",
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
});
