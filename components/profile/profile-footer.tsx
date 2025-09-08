import { View, Text } from 'react-native';
import { Button } from '../ui/button';
import { IconLogout } from '@tabler/icons-react-native';
import { useLogoutMutation } from '@/hooks/useAuth';

export default function ProfileFooter() {
  const { mutateAsync: logout } = useLogoutMutation();
  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.log('Error at loggin out', error);
    }
  }
  return (
    <View>
      <Text>
        <Button onPress={handleLogout}>
          Logout <IconLogout />{' '}
        </Button>
      </Text>
    </View>
  );
}
