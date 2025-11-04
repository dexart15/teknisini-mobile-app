import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40; // minus padding (20px each side)
const AUTO_SCROLL_INTERVAL = 3000; // 3 detik

interface Banner {
  id: string;
  image: any;
}

const banners: Banner[] = [
  { id: '1', image: require('@/assets/images/banner.png') },
  { id: '2', image: require('@/assets/images/banner2.png') },
  { id: '3', image: require('@/assets/images/banner3.png') },
];

const BannerCarousel = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: Banner }) => (
    <View className="mr-2">
      <Image
        source={item.image}
        className="rounded-xl"
        style={{ width: BANNER_WIDTH, height: 150 }}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View className="mb-5">
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={width}
        decelerationRate="fast"
        onScrollToIndexFailed={() => {}}
      />

      {/* Dot Indicators */}
      <View className="flex-row justify-center mt-3">
        {banners.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              index === currentIndex
                ? 'bg-primary w-6'
                : 'bg-gray-300 w-2'
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerCarousel;