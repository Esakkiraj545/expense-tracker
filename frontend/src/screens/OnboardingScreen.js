import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, Animated } from 'react-native';
import { ChevronRight, ArrowRight } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: 'Track every rupee',
      description: 'Take complete control of your finances. Categorize expenses and eliminate debt with professional precision and clarity.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000',
    },
    {
      id: 2,
      title: 'Never forget a debt',
      description: 'Keep track of who owes you and who you owe. Get smart reminders and settle debts with a single tap.',
      image: 'https://images.unsplash.com/photo-1573164060897-425941c30241?q=80&w=1000',
    },
    {
      id: 3,
      title: 'Plan trips stress-free',
      description: 'Split bills with friends automatically. Manage group expenses and settle up without the awkward math.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
    },
  ];

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
      navigation.replace('Login');
    }
  };

  const handleSkip = async () => {
    await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
    navigation.replace('Login');
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      },
    }
  );

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
           <View className="w-8 h-8 bg-[#2E3A9D] rounded-lg items-center justify-center mr-2">
              <View className="w-4 h-4 border-2 border-white rounded-sm" />
           </View>
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xl">Xpenso</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-xs">Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={slidesRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width }} className="px-10 items-center justify-center">
             <View className="bg-white rounded-[40px] p-6 shadow-2xl shadow-blue-900/10 border border-[#F0F2FA] mb-12">
                <Image 
                  source={{ uri: slide.image }} 
                  style={{ width: width - 140, height: width - 140 }} 
                  className="rounded-[32px]"
                />
             </View>
             
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-3xl text-center mb-4">
                {slide.title}
             </Text>
             <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#444B59] text-sm text-center leading-6">
                {slide.description}
             </Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View className="px-10 pb-14 items-center">
        {/* Pagination Dots */}
        <View className="flex-row mb-10">
          {slides.map((_, i) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View 
                key={i} 
                style={{ width: dotWidth, opacity }} 
                className="h-2 bg-[#2E3A9D] rounded-full mx-1" 
              />
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          onPress={handleNext}
          className="bg-[#2E3A9D] w-full py-5 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-blue-500/50"
        >
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color="white" />
        </TouchableOpacity>
        
        <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] mt-6">
          Step {currentIndex + 1} of 3
        </Text>
      </View>
    </View>
  );
};

export default OnboardingScreen;
