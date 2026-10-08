import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { useTheme } from '@/shared/theme';
import { StarIcon } from '@/shared/ui';

import { useToggleFavorite } from '../model/use-toggle-favorite';

type Props = { postId: number };

const HIT_SLOP = 12;

export function ToggleFavoriteButton({ postId }: Props) {
  const { isFavorite, toggle } = useToggleFavorite(postId);
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    toggle();
    scale.setValue(0.6);

    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 160,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? 'Remove from favorites' : 'Add to favorites'
      }
      accessibilityState={{ selected: isFavorite }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <StarIcon
          filled={isFavorite}
          size={24}
          color={isFavorite ? colors.star : colors.text}
        />
      </Animated.View>
    </Pressable>
  );
}
