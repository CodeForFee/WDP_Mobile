import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TextInputProps,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SIZES, TYPOGRAPHY, SHADOWS } from '@/constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    hint?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    size?: 'sm' | 'md' | 'lg';
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    rightElement?: React.ReactNode;
    variant?: 'outline' | 'filled' | 'pill';
}

export function Input({
    label,
    error,
    hint,
    icon,
    iconPosition = 'left',
    size = 'md',
    containerStyle,
    inputStyle,
    rightElement,
    secureTextEntry,
    variant = 'filled', // Default to filled for softer look
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { height: SIZES.inputSm, fontSize: TYPOGRAPHY.fontSize.sm };
            case 'lg':
                return { height: SIZES.inputLg, fontSize: TYPOGRAPHY.fontSize.lg };
            default:
                return { height: SIZES.inputMd, fontSize: TYPOGRAPHY.fontSize.base };
        }
    };

    const sizeStyles = getSizeStyles();

    const isPassword = secureTextEntry !== undefined;
    const showPassword = isPassword && !isPasswordVisible && secureTextEntry;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    { height: sizeStyles.height },
                    variant === 'outline' && styles.variantOutline,
                    variant === 'filled' && styles.variantFilled,
                    variant === 'pill' && styles.variantPill,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
            >
                {icon && iconPosition === 'left' && (
                    <Ionicons
                        name={icon}
                        size={SIZES.iconSm}
                        color={isFocused ? COLORS.primary : COLORS.textMuted}
                        style={styles.iconLeft}
                    />
                )}

                <TextInput
                    style={[
                        styles.input,
                        { fontSize: sizeStyles.fontSize },
                        inputStyle,
                    ]}
                    placeholderTextColor={COLORS.textMuted}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={showPassword}
                    cursorColor={COLORS.primary}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.passwordToggle}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={SIZES.iconSm}
                            color={COLORS.textMuted}
                        />
                    </TouchableOpacity>
                )}

                {icon && iconPosition === 'right' && !isPassword && (
                    <Ionicons
                        name={icon}
                        size={SIZES.iconSm}
                        color={isFocused ? COLORS.primary : COLORS.textMuted}
                        style={styles.iconRight}
                    />
                )}

                {rightElement}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
            {hint && !error && <Text style={styles.hint}>{hint}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs, // Slight indentation
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: RADIUS.lg,
        paddingHorizontal: SPACING.md,
        overflow: 'hidden',
    },
    // Variants
    variantFilled: {
        backgroundColor: COLORS.backgroundSecondary,
        borderWidth: 1,
        borderColor: COLORS.border, // Add border to filled input too
    },
    variantOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.borderDark, // Darker border for outline
    },
    variantPill: {
        backgroundColor: COLORS.backgroundSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.full,
    },
    // States
    inputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.cardBackground,
        ...SHADOWS.sm,
    },
    inputError: {
        borderColor: COLORS.error,
        backgroundColor: COLORS.errorLight,
    },
    input: {
        flex: 1,
        color: COLORS.textPrimary,
        paddingVertical: 0,
        height: '100%',
    },
    iconLeft: {
        marginRight: SPACING.sm,
    },
    iconRight: {
        marginLeft: SPACING.sm,
    },
    passwordToggle: {
        padding: SPACING.xs,
    },
    error: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.error,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    hint: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textMuted,
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
});
