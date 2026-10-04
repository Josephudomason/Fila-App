import { Account, Avatars, Client, Databases, Realtime } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1',
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? 'com.joedev.file',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? '6a897da6001fa7b5329d',
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);

export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const realtime = new Realtime(client);
