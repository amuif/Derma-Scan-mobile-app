import ProfileHeader from '@/components/profile/profile-header';
import { ThemedView } from '@/components/ThemedView';

export const Profile = () => {
  return (
    <ThemedView className='pt-10 min-h-screen'>
      <ProfileHeader />
    </ThemedView>
  );
};
export default Profile;
