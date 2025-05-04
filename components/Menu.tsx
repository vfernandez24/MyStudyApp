import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Inicio"
        icon={({ color, size }) => <Ionicons name="home" color={color} size={size} />}
        onPress={() => router.push('/(drawer)/home')}
      />
      <DrawerItem
        label="Configuración"
        icon={({ color, size }) => <Ionicons name="settings" color={color} size={size} />}
        onPress={() => router.push('/(drawer)/settings')}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} />
  );
}
