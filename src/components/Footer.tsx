
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Phone, MessageCircle } from "lucide-react";

interface SocialMediaData {
  links: {
    facebook: string;
    whatsapp: string;
    instagram: string;
    tiktok: string;
    telegram: string;
    youtube: string;
  };
  enabled: boolean;
  showInFooter: boolean;
}

const Footer = () => {
  const [socialData, setSocialData] = useState<SocialMediaData | null>(null);

  useEffect(() => {
    fetch('/data/social_media.json')
      .then(response => response.json())
      .then(data => setSocialData(data))
      .catch(error => console.error('Error loading social media data:', error));
  }, []);

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home", labelAr: "الرئيسية" },
    { to: "/about", label: "About Us", labelAr: "من نحن" },
    { to: "/policy", label: "User Policy", labelAr: "سياسة المستخدم" },
    { to: "/contact", label: "Contact Us", labelAr: "اتصل بنا" },
  ];

  const categories = [
    { to: "/category/tools", label: "Tools", labelAr: "أدوات" },
    { to: "/category/gifts", label: "Gifts", labelAr: "هدايا" },
    { to: "/category/games", label: "Games", labelAr: "ألعاب" },
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      case 'whatsapp': return MessageCircle;
      case 'telegram': return MessageCircle;
      case 'tiktok': return Phone;
      default: return Phone;
    }
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Offer Game
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted platform for amazing offers and rewards. Complete tasks and earn valuable prizes.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed" dir="rtl">
              منصتك الموثوقة للعروض والمكافآت المذهلة. أكمل المهام واكسب جوائز قيمة.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.to}>
                  <Link
                    to={category.to}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            {socialData?.enabled && socialData?.showInFooter && (
              <div className="flex flex-wrap gap-3">
                {Object.entries(socialData.links).map(([platform, url]) => {
                  if (!url) return null;
                  const IconComponent = getSocialIcon(platform);
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
                    >
                      <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            )}
            <div className="text-xs text-gray-500">
              <p>© {currentYear} Offer Game. All rights reserved.</p>
              <p className="mt-1">Made with ❤️ for amazing rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>Designed for the best user experience and maximum rewards</p>
            <p className="mt-2 md:mt-0">Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
