import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING, SIZES, TYPOGRAPHY } from '@/constants/theme';

interface ButtonProps {
    title?: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'soft';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    children?: React.ReactNode;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    style,
    textStyle,
    children,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    container: styles.primaryContainer,
                    text: styles.primaryText,
                    iconColor: COLORS.textLight,
                };
            case 'secondary':
                return {
                    container: styles.secondaryContainer,
                    text: styles.secondaryText,
                    iconColor: COLORS.primaryDark,
                };
            case 'outline':
                return {
                    container: styles.outlineContainer,
                    text: styles.outlineText,
                    iconColor: COLORS.primary,
                };
            case 'ghost':
                return {
                    container: styles.ghostContainer,
                    text: styles.ghostText,
                    iconColor: COLORS.primary,
                };
            case 'danger':
                return {
                    container: styles.dangerContainer,
                    text: styles.dangerText,
                    iconColor: COLORS.textLight,
                };
            case 'soft':
                return {
                    container: styles.softContainer,
                    text: styles.softText,
                    iconColor: COLORS.primary,
                };
            default:
                return {
                    container: styles.primaryContainer,
                    text: styles.primaryText,
                    iconColor: COLORS.textLight,
                };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return {
                    container: { height: SIZES.buttonSm, paddingHorizontal: SPACING.md },
                    text: { fontSize: TYPOGRAPHY.fontSize.sm },
                    iconSize: SIZES.iconXs,
                };
            case 'lg':
                return {
                    container: { height: SIZES.buttonLg, paddingHorizontal: SPACING.xl },
                    text: { fontSize: TYPOGRAPHY.fontSize.lg },
                    iconSize: SIZES.iconMd,
                };
            default:
                return {
                    container: { height: SIZES.buttonMd, paddingHorizontal: SPACING.lg },
                    text: { fontSize: TYPOGRAPHY.fontSize.base },
                    iconSize: SIZES.iconSm,
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator color={variantStyles.iconColor} size="small" />;
        }

        if (children) {
            return children;
        }

        return (
            <View style={styles.contentContainer}>
                {icon && iconPosition === 'left' && (
                    <Ionicons
                        name={icon}
                        size={sizeStyles.iconSize}
                        color={variantStyles.iconColor}
                        style={styles.iconLeft}
                    />
                )}
                {title && (
                    <Text
                        style={[
                            styles.text,
                            variantStyles.text,
                            sizeStyles.text,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                )}
                {icon && iconPosition === 'right' && (
                    <Ionicons
                        name={icon}
                        size={sizeStyles.iconSize}
                        color={variantStyles.iconColor}
                        style={styles.iconRight}
                    />
                )}
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                variantStyles.container,
                sizeStyles.container,
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {renderContent()}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.full, // Pill shape buttons
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        letterSpacing: 0.3,
    },
    iconLeft: {
        marginRight: SPACING.sm,
    },
    iconRight: {
        marginLeft: SPACING.sm,
    },
    // Primary
    primaryContainer: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.md,
        shadowColor: COLORS.primary, // Colored shadow
    },
    primaryText: {
        color: COLORS.textLight,
    },
    // Secondary
    secondaryContainer: {
        backgroundColor: COLORS.cream,
    },
    secondaryText: {
        color: COLORS.primaryDark,
    },
    // Outline
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    outlineText: {
        color: COLORS.primary,
    },
    // Ghost
    ghostContainer: {
        backgroundColor: 'transparent',
    },
    ghostText: {
        color: COLORS.primary,
    },
    // Danger
    dangerContainer: {
        backgroundColor: COLORS.error,
        ...SHADOWS.md,
        shadowColor: COLORS.error,
    },
    dangerText: {
        color: COLORS.textLight,
    },
    // Soft
    softContainer: {
        backgroundColor: COLORS.primaryLight,
    },
    softText: {
        color: COLORS.primaryDark,
    },
});
