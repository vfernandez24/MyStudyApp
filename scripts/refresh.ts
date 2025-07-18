import { useRouter } from 'expo-router';

const router = useRouter();

const reloadScreen = () => {
  router.replace({
    pathname: '/(drawer)/teachers',
    params: { refresh: Date.now() },
  });
};

export default reloadScreen;