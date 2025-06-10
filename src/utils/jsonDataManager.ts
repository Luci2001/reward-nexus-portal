
import { useLiveJson } from '@/hooks/useLiveJson';

// Default data structures
const defaultArticlesData = {
  offers: [],
  categories: [],
  offerTypes: [],
  rewardTypes: []
};

const defaultPoliciesData = {
  userPolicy: {
    title: "User Policy",
    titleAr: "سياسة المستخدم",
    content: "",
    contentAr: ""
  },
  aboutUs: {
    title: "About Us",
    titleAr: "من نحن",
    content: "",
    contentAr: ""
  },
  contactUs: {
    title: "Contact Us",
    titleAr: "اتصل بنا",
    email: "",
    phone: "",
    address: "",
    addressAr: ""
  }
};

const defaultSocialMediaData = {
  links: {
    facebook: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    telegram: "",
    youtube: ""
  },
  enabled: false,
  showInHeader: false,
  showInFooter: false
};

const defaultAdsData = {
  adsterra: {
    banner_top: "",
    banner_bottom: "",
    sidebar_left: "",
    sidebar_right: "",
    popup: "",
    native_ads: "",
    video_ads: ""
  },
  settings: {
    enabled: false,
    showOnPages: [],
    frequency: {
      popup: 30000,
      banner_rotation: 10000
    }
  }
};

const defaultMessagesData = {
  messages: []
};

// Hooks for each JSON file
export const useArticlesData = () => {
  return useLiveJson('/data/articles.json', defaultArticlesData, {
    pollingInterval: 1500,
    enableInProduction: true
  });
};

export const usePoliciesData = () => {
  return useLiveJson('/data/policies.json', defaultPoliciesData, {
    pollingInterval: 2000,
    enableInProduction: true
  });
};

export const useSocialMediaData = () => {
  return useLiveJson('/data/social_media.json', defaultSocialMediaData, {
    pollingInterval: 2000,
    enableInProduction: true
  });
};

export const useAdsData = () => {
  return useLiveJson('/data/ads.json', defaultAdsData, {
    pollingInterval: 2000,
    enableInProduction: true
  });
};

export const useMessagesData = () => {
  return useLiveJson('/data/msg.json', defaultMessagesData, {
    pollingInterval: 1000,
    enableInProduction: true
  });
};

// Utility function to save data back to JSON (for development)
export const saveJsonData = async (path: string, data: any) => {
  if (import.meta.env.DEV) {
    console.warn('[JSON Data Manager] Saving data is only supported in development mode');
    console.log('Data to save:', data);
    // In a real scenario, you'd need a backend API to handle file writes
  }
};
