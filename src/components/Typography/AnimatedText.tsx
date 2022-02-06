import * as React from 'react';
import {
  Animated,
  TextStyle,
  I18nManager,
  StyleProp,
  StyleSheet,
} from 'react-native';
import { withTheme } from '../../core/theming';
import { Font, MD3TypescaleKey, Theme } from '../../types';

type Props = React.ComponentPropsWithRef<typeof Animated.Text> & {
  /**
   * Variant defines appropriate text styles for type role and its size.
   * Available variants:
   *
   *  Display: `display-large`, `display-small`, `display-small`
   *
   *  Headline: `headline-large`, `headline-medium`, `headline-small`
   *
   *  Title: `title-large`, `title-medium`, `title-small`
   *
   *  Label:  `label-large`, `label-medium`, `label-small`
   *
   *  Body: `body-large`, `body-medium`, `body-small`
   */
  variant?: keyof typeof MD3TypescaleKey;
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * Animated text component which follows styles from the theme.
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */
function AnimatedText({
  style,
  theme,
  variant = 'labelLarge',
  ...rest
}: Props) {
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  if (theme.isV3 && variant) {
    const stylesByVariant = Object.keys(MD3TypescaleKey).reduce(
      (acc, key) => {
        const { size, weight, lineHeight, tracking } =
          theme.typescale[key as keyof typeof MD3TypescaleKey];

        return {
          ...acc,
          [key]: {
            fontSize: size,
            fontWeight: weight,
            lineHeight: lineHeight,
            letterSpacing: tracking,
            color: theme.colors.onSurface,
          },
        };
      },
      {} as {
        [key in MD3TypescaleKey]: {
          fontSize: number;
          fontWeight: Font['fontWeight'];
          lineHeight: number;
          letterSpacing: number;
        };
      }
    );

    const styleForVariant = stylesByVariant[variant];

    return (
      <Animated.Text
        {...rest}
        style={[styleForVariant, styles.text, { writingDirection }, style]}
      />
    );
  } else {
    return (
      <Animated.Text
        {...rest}
        style={[
          styles.text,
          {
            ...theme.fonts.regular,
            color: theme.isV3 ? theme.colors.onSurface : theme.colors.text,
            writingDirection,
          },
          style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default withTheme(AnimatedText);
