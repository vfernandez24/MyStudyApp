import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveData(data: string, value: string) {
  await AsyncStorage.setItem(value, JSON.stringify(data));
}

export async function getData(value: string) {
  return await AsyncStorage.getItem(value);
}

export async function deleteData(value: string) {
  await AsyncStorage.removeItem(value);
}
