
import { Users, Target, Award, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePoliciesData } from '@/utils/jsonDataManager';

const AboutUs = () => {
  const { data: aboutData, loading, error } = usePoliciesData();

  const features = [
    {
      icon: Users,
      title: "Community Focused",
      description: "Building a thriving community of reward earners and offer providers."
    },
    {
      icon: Target,
      title: "Quality Offers",
      description: "Carefully curated offers that provide real value and genuine rewards."
    },
    {
      icon: Award,
      title: "Instant Rewards",
      description: "Quick and reliable reward delivery system for completed offers."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Safe and secure environment for all your reward earning activities."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error loading page data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {aboutData?.aboutUs.title || "About Us"}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {aboutData?.aboutUs.content || "We are dedicated to connecting users with amazing offers and rewards through our innovative CPA platform."}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            To create the most user-friendly and rewarding CPA offers platform that benefits both users and advertisers. 
            We believe in fair rewards, transparent processes, and building long-term relationships with our community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { label: "Active Users", value: "50K+" },
            { label: "Offers Completed", value: "500K+" },
            { label: "Rewards Delivered", value: "$2M+" },
            { label: "Partner Networks", value: "100+" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Live Update Indicator */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            🔄 Live JSON Updates Active
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
