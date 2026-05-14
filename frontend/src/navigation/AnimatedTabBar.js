import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, FadeIn } from 'react-native-reanimated';
import { LayoutGrid, Wallet, CreditCard, Plane, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 32;
const TAB_WIDTH = TAB_BAR_WIDTH / 5;


const AnimatedTabBar = ({ state, descriptors, navigation }) => {
  const offset = useSharedValue(state.index * TAB_WIDTH);


  useEffect(() => {
    offset.value = state.index * TAB_WIDTH;
  }, [state.index]);


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });


  const icons = {
    Dashboard: LayoutGrid,
    Expenses: Wallet,
    Debts: CreditCard,
    Trips: Plane,
    Profile: User,
  };

  return (
    <View style={{ position: 'absolute', bottom: 30, left: 16, right: 16 }}>
      <View className="bg-white rounded-[22px] h-20 flex-row items-center shadow-2xl border border-[#F0F2FA] overflow-hidden">
        {/* Animated Background Bubble */}
        <Animated.View 
          style={[
            animatedStyle,
            {
              position: 'absolute',
              width: TAB_WIDTH - 8,
              height: 40,
              backgroundColor: '#2E3A9D',
              borderRadius: 8,
              marginHorizontal: 4,
              top: 12,
            }
          ]}
        />





        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;
          const Icon = icons[route.name] || LayoutGrid;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              className="flex-1 items-center justify-center h-full"
              activeOpacity={0.8}
            >
              <View className="items-center justify-center">
                <Icon size={20} color={isFocused ? 'white' : '#8A94A6'} />
                <Text 
                  style={{ 
                    fontFamily: isFocused ? 'Poppins-Bold' : 'Poppins-Medium',
                    fontSize: 8,
                    marginTop: 2,
                    color: isFocused ? 'white' : '#8A94A6',
                    letterSpacing: -0.2
                  }}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AnimatedTabBar;
