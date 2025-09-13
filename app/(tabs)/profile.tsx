import ProfileData from '@/components/profile/profile-data';
import ProfileFooter from '@/components/profile/profile-footer';
import ProfileHeader from '@/components/profile/profile-header';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView, StyleSheet } from 'react-native';

export const Profile = () => {
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContentContainer}
      showsVerticalScrollIndicator={true}
    >
      <ThemedView className="pt-10 min-h-screen">
        <ProfileHeader />
        <ProfileData />
        <ProfileFooter />
      </ThemedView>
    </ScrollView>
  );
};
export default Profile;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {},
  container: {
    flex: 1,
  },
});
