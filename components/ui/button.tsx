import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled = false,
  className = '',
  style,
  ...props
}: ButtonProps) => {
  const baseStyles: ViewStyle = {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: disabled ? '#94a3b8' : '#007AFF',
    },
    secondary: {
      backgroundColor: disabled ? '#94a3b8' : '#5856D6',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? '#94a3b8' : '#007AFF',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    destructive: {
      backgroundColor: disabled ? '#94a3b8' : '#FF3B30',
    },
  };

  const sizeStyles: Record<string, ViewStyle> = {
    sm: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 36,
    },
    md: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 44,
    },
    lg: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      minHeight: 52,
    },
  };

  const textStyles: Record<string, TextStyle> = {
    primary: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    secondary: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    outline: {
      color: disabled ? '#94a3b8' : '#007AFF',
      fontWeight: '600',
    },
    ghost: {
      color: disabled ? '#94a3b8' : '#007AFF',
      fontWeight: '600',
    },
    destructive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  };

  const textSizeStyles: Record<string, TextStyle> = {
    sm: {
      fontSize: 14,
    },
    md: {
      fontSize: 16,
    },
    lg: {
      fontSize: 18,
    },
  };

  return (
    <TouchableOpacity
      style={[baseStyles, variantStyles[variant], sizeStyles[size], style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost' ? '#007AFF' : '#FFFFFF'
          }
        />
      )}
      <Text
        style={[
          textStyles[variant],
          textSizeStyles[size],
          { opacity: loading ? 0.7 : 1 },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
