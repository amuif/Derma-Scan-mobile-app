import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useAuthStore } from '@/stores/auth';
import { IconPencil } from '@tabler/icons-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { useUpdateCurrentUser } from '@/hooks/useAuth';
import { BACKEND_BASE, BACKEND_URL } from '@/constants/backend-url';

export default function ProfileHeader() {
  const { user } = useAuthStore();
  const { mutateAsync: updateUser } = useUpdateCurrentUser();
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    user?.profilePicture,
  );

  useEffect(() => {
    setProfilePicturePreview(user?.profilePicture);
    console.log(profilePicturePreview);
  }, [user, profilePicturePreview]);

  const getProfilePictureUri = () => {
    if (!profilePicturePreview) return undefined;

    if (profilePicturePreview.startsWith('file://'))
      return profilePicturePreview;

    return `${profilePicturePreview}`;
  };

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

  return (
    user && (
      <ThemedView className="pt-5 flex-col gap-4">
        <ThemedText className="font-bold mx-auto pt-12" style={styles.header}>
          Profile
        </ThemedText>

        <ThemedView style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: getProfilePictureUri() }}
          />

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
    backgroundColor: '#0553',
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
