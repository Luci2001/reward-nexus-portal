
import { useState, useEffect } from 'react';
import { Shield, FileText, Eye, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PolicyData {
  userPolicy: {
    title: string;
    titleAr?: string;
    content: string;
    contentAr?: string;
  };
}

const UserPolicy = () => {
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/policies.json');
        const data = await response.json();
        setPolicyData(data);
      } catch (error) {
        console.error('Error loading policy data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const policyItems = [
    {
      icon: Shield,
      title: "Privacy Protection",
      description: "We protect your personal information and never share it without your consent."
    },
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Clear and fair terms that protect both users and our platform."
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Open communication about how our platform works and how you earn rewards."
    },
    {
      icon: Lock,
      title: "Data Security",
      description: "Advanced security measures to keep your information safe and secure."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {policyData?.userPolicy.title || "User Policy"}
          </h1>
          <p className="text-xl text-gray-300">
            Understanding your rights and our commitments to you
          </p>
        </div>

        {/* Policy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {policyItems.map((item, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Policy Content */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed space-y-6">
                {policyData?.userPolicy.content ? (
                  <div className="whitespace-pre-line">
                    {policyData.userPolicy.content}
                  </div>
                ) : (
                  <>
                    <section>
                      <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
                      <p>
                        By using our CPA offers platform, you agree to comply with these terms and conditions. 
                        Our platform is designed to connect users with legitimate offers and ensure fair compensation for completed tasks.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-white mb-4">User Rights</h2>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Right to fair and timely reward distribution</li>
                        <li>Right to clear information about offer requirements</li>
                        <li>Right to privacy and data protection</li>
                        <li>Right to customer support and assistance</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Complete offers honestly and according to requirements</li>
                        <li>Provide accurate information when required</li>
                        <li>Respect the terms of individual offers</li>
                        <li>Report any issues or violations promptly</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
                      <p>
                        We are committed to protecting your privacy. We only collect information necessary for 
                        platform operation and reward distribution. Your personal data is never sold or shared 
                        with third parties without your explicit consent.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                      <p>
                        We use cookies to enhance your experience and track offer completions for reward purposes. 
                        You can control cookie settings through your browser, though this may affect platform functionality.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                      <p>
                        If you have any questions about these policies or need assistance, please contact our 
                        support team. We're here to help ensure you have the best experience on our platform.
                      </p>
                    </section>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default UserPolicy;
