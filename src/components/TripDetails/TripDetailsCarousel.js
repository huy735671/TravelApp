import React, {useRef} from 'react';
import {View, StyleSheet, Image, Animated, Text} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import * as Animatable from 'react-native-animatable';
import CarouselIndicators from '../shared/CarouselIndicators';
import {sizes} from '../../constants/theme';

const TripDetailsCarousel = ({slides, id}) => {
  const scrollAnimated = useRef(new Animated.Value(0)).current;

  const validSlides = slides.filter(slide => slide); // Lọc bỏ hình ảnh không hợp lệ

  return (
    <>
      <Animated.FlatList
        data={validSlides}
        horizontal
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollAnimated}}}],
          {useNativeDriver: false},
        )}
        renderItem={({item: image, index}) => (
          <View style={styles.slide}>
            {index === 0 ? (
              <SharedElement id={`trip.${id}.image`} style={styles.slide}>
                <Image source={{uri: image}} style={styles.image} />
              </SharedElement>
            ) : (
              <Image source={{uri: image}} style={styles.image} />
            )}
          </View>
        )}
      />
      {validSlides.length > 1 && (
        <Animatable.View
          style={styles.indicators}
          animation="fadeInUp"
          delay={550}
          duration={400}
          easing="ease-in-out">
          <CarouselIndicators
            slidesCount={validSlides.length}
            slideWidth={sizes.width}
            dotSize={12}
            dotSpacing={8}
            scrollAnimated={scrollAnimated}
          />
        </Animatable.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: sizes.width,
    height: sizes.height,
  },
  image: {
    width: sizes.width,
    height: sizes.height,
    resizeMode: 'cover',
  },
  indicators: {
    position: 'absolute',
    width: sizes.width,
    bottom: 60,
    alignItems: 'center',
  },
});

export default TripDetailsCarousel;
