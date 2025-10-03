import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { IconPencil } from '@tabler/icons-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { useCurrentUserQuery, useUpdateCurrentUser } from '@/hooks/useAuth';
import { FILES_URL } from '@/constants/backend-url';

export default function ProfileHeader() {
  const { data: user, isLoading, isError } = useCurrentUserQuery();
  const { mutateAsync: updateUser } = useUpdateCurrentUser();
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    user?.profilePicture,
  );

  useEffect(() => {
    if (user && user?.profilePicture) {
      setProfilePicturePreview(user.profilePicture);
    }
  }, [user]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        setProfilePicturePreview(uri);
        updateUser({ profilePicture: uri });
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const fullImageUrl =
    profilePicturePreview?.startsWith('http') ||
    profilePicturePreview?.startsWith('file')
      ? profilePicturePreview
      : profilePicturePreview
        ? `${FILES_URL}${profilePicturePreview}`
        : null;
  console.log('Rendering with image URL:', fullImageUrl);

  if (isLoading) {
    return <Text>Loading..............</Text>;
  }
  if (isError) {
    return <Text>Error occurred check your console,{isError}</Text>;
  }
  return (
    user && (
      <ThemedView className="pt-5 flex-col gap-4">
        <ThemedText className="font-bold mx-auto pt-12" style={styles.header}>
          Profile
        </ThemedText>

        <ThemedView style={styles.imageContainer}>
          {fullImageUrl ? (
            <Image
              style={styles.image}
              source={{ uri: fullImageUrl }}
              onLoad={() => console.log('✅ Image loaded successfully')}
              onError={(e) => console.log('❌ Image loading error:', e.error)}
            />
          ) : (
            <ThemedView style={[styles.image, styles.initialsContainer]}>
              <ThemedText style={styles.initials}>
                {getInitials(user.name)}
              </ThemedText>
            </ThemedView>
          )}{' '}
          <TouchableOpacity
            style={styles.changeButton}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <IconPencil size={20} color="white" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView className="flex items-center justify-center w-full">
          <ThemedText style={styles.name}>{user.name}</ThemedText>
          <ThemedText style={styles.email}>{user.email}</ThemedText>
        </ThemedView>
      </ThemedView>
    )
  );
}

const styles = StyleSheet.create({
  header: {
    alignContent: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  name: {
    alignContent: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  email: {
    alignContent: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    height: 200,
    width: 200,
    borderRadius: 100,
    paddingVertical: 5,
    position: 'relative',
  },
  image: {
    borderRadius: 100,
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  changeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
