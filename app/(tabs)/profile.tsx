import ProfileData from '@/components/profile/profile-data';
import ProfileFooter from '@/components/profile/profile-footer';
import ProfileHeader from '@/components/profile/profile-header';
import { ThemedView } from '@/components/ThemedView';

export const Profile = () => {
  return (
    <ThemedView className="pt-10 min-h-screen">
      <ProfileHeader />
      <ProfileData />
      <ProfileFooter />
    </ThemedView>
  );
};
export default Profile;
