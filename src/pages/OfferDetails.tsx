import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Gift, Star, CheckCircle, ExternalLink, Share2, Users, Shield, Award, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import OfferCard from '@/components/OfferCard';

interface Step {
  stepNumber: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  action: string;
}

interface Offer {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  offerType: string;
  offerTypeAr?: string;
  image: string;
  reward: string;
  rewardAr?: string;
  rewardType: string;
  rewardLink: string;
  rewardFile?: string;
  offerUrl: string;
  completionUrl: string;
  featured: boolean;
  trending: boolean;
  points: number;
  estimatedTime: string;
  requirements: string[];
  requirementsAr?: string[];
  steps: Step[];
  seoTitle?: string;
  seoDescription?: string;
}

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [suggestedOffers, setSuggestedOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const loadOffer = async () => {
      try {
        const response = await fetch('/data/articles.json');
        const data = await response.json();
        const foundOffer = data.offers.find((o: Offer) => o.id === id);
        setOffer(foundOffer || null);
        
        // Get suggested offers (other offers excluding current one)
        const otherOffers = data.offers.filter((o: Offer) => o.id !== id);
        // Prioritize featured and trending offers
        const prioritized = otherOffers.sort((a: Offer, b: Offer) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return b.points - a.points; // Sort by points descending
        });
        setSuggestedOffers(prioritized.slice(0, 3));
        
        // Check if user has completed this offer
        const completedOffers = JSON.parse(localStorage.getItem('completed-offers') || '[]');
        setHasCompleted(completedOffers.includes(id));
      } catch (error) {
        console.error('Error loading offer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [id]);

  useEffect(() => {
    if (offer) {
      document.title = offer.seoTitle || offer.title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && offer.seoDescription) {
        metaDescription.setAttribute('content', offer.seoDescription);
      }
    }
  }, [offer]);

  const handleStartOffer = () => {
    if (!offer) return;
    
    // Track offer start
    const userId = localStorage.getItem('user-id') || 'anonymous';
    console.log(`User ${userId} started offer ${offer.id}`);
    
    // Open offer URL in new tab
    window.open(offer.offerUrl, '_blank');
    
    toast({
      title: "Offer Started!",
      description: "Complete the requirements in the new tab to claim your reward.",
    });
  };

  const handleClaimReward = () => {
    if (!offer) return;
    
    // Mark as completed
    const completedOffers = JSON.parse(localStorage.getItem('completed-offers') || '[]');
    if (!completedOffers.includes(offer.id)) {
      completedOffers.push(offer.id);
      localStorage.setItem('completed-offers', JSON.stringify(completedOffers));
    }
    
    setHasCompleted(true);
    
    // Open reward link or file
    const rewardUrl = offer.rewardLink || offer.rewardFile || offer.completionUrl;
    window.open(rewardUrl, '_blank');
    
    toast({
      title: "تم استلام المكافأة!",
      description: `لقد حصلت بنجاح على: ${offer.reward}`,
    });
  };

  const handleShare = () => {
    if (!offer) return;
    
    const shareData = {
      title: offer.titleAr || offer.title,
      text: offer.descriptionAr || offer.description,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.log('Error sharing:', error);
        fallbackShare();
      });
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "تم نسخ الرابط!",
          description: "تم نسخ رابط العرض إلى الحافظة",
        });
      });
    } else {
      toast({
        title: "شارك هذا العرض",
        description: "انسخ الرابط من شريط العناوين لمشاركة هذا العرض",
      });
    }
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'gift_card': return Gift;
      case 'account': return Users;
      case 'coins': return Star;
      case 'software': return Download;
      case 'file': return FileText;
      default: return Gift;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'download': return Download;
      case 'survey': return FileText;
      case 'install': return Download;
      case 'register': return Users;
      case 'verify': return CheckCircle;
      case 'share': return Share2;
      case 'review': return Star;
      default: return CheckCircle;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">العرض غير موجود</h1>
          <Link to="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  const RewardIcon = getRewardIcon(offer.rewardType);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          العودة للعروض
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {offer.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          <Star className="w-3 h-3 mr-1" />
                          مميز
                        </Badge>
                      )}
                      {offer.trending && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          رائج
                        </Badge>
                      )}
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {offer.category}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {offer.offerTypeAr || offer.offerType}
                      </Badge>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                      {offer.titleAr || offer.title}
                    </h1>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-gray-400 hover:text-white"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Enhanced Description Section */}
                <div className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-400" />
                    فرصة رائعة
                  </h2>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    {offer.descriptionAr || offer.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold">انضم للآلاف</h3>
                      <p className="text-gray-400 text-sm">المستخدمين الذين حصلوا على هذا العرض</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold">آمن 100%</h3>
                      <p className="text-gray-400 text-sm">عملية آمنة ومُتحقق منها</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <RewardIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold">مكافأة فورية</h3>
                      <p className="text-gray-400 text-sm">احصل على مكافأتك فوراً</p>
                    </div>
                  </div>
                </div>

                {/* Steps Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    الخطوات المطلوبة
                  </h3>
                  <div className="grid gap-4">
                    {offer.steps.map((step, index) => {
                      const ActionIcon = getActionIcon(step.action);
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {step.stepNumber}
                          </div>
                          <ActionIcon className="w-6 h-6 text-blue-400" />
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{step.titleAr || step.title}</h4>
                            <p className="text-gray-300 text-sm">{step.descriptionAr || step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {!hasCompleted ? (
                    <Button
                      onClick={handleStartOffer}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex-1 text-lg py-6"
                    >
                      <ExternalLink className="w-6 h-6 mr-3" />
                      ابدأ هذا العرض الرائع
                    </Button>
                  ) : (
                    <Button
                      onClick={handleClaimReward}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1 text-lg py-6"
                    >
                      <RewardIcon className="w-6 h-6 mr-3" />
                      احصل على مكافأتك الآن
                    </Button>
                  )}
                  
                  {hasCompleted && (
                    <div className="flex items-center justify-center gap-3 text-green-400 flex-1 text-lg">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-medium">تم الإنجاز بنجاح!</span>
                    </div>
                  )}
                </div>

                {/* Reward Details */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <RewardIcon className="w-6 h-6 text-purple-400" />
                    تفاصيل المكافأة
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">نوع المكافأة:</span>
                      <span className="text-purple-300 font-medium">{offer.rewardType}</span>
                    </div>
                    {offer.rewardLink && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">رابط المكافأة:</span>
                        <span className="text-blue-300 text-sm truncate max-w-48">{offer.rewardLink}</span>
                      </div>
                    )}
                    {offer.rewardFile && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">ملف المكافأة:</span>
                        <span className="text-green-300 text-sm">متوفر للتحميل</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reward Info */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <RewardIcon className="w-5 h-5 text-purple-400" />
                  تفاصيل المكافأة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 font-bold text-xl mb-2">{offer.rewardAr || offer.reward}</p>
                  <p className="text-gray-400 text-sm">مكافأتك المميزة</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">النقاط المكتسبة:</span>
                    <span className="text-white font-bold">{offer.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">وقت الإنجاز:</span>
                    <span className="text-white font-medium">{offer.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">نوع العرض:</span>
                    <span className="text-blue-400 font-medium">{offer.offerTypeAr || offer.offerType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Average completion: {offer.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Instant reward delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">95% success rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">5000+ completed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Suggested Offers Section */}
        {suggestedOffers.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">More Amazing Offers</h2>
              <p className="text-gray-400 text-lg">Don't miss these incredible opportunities</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedOffers.map((suggestedOffer) => (
                <OfferCard 
                  key={suggestedOffer.id} 
                  offer={suggestedOffer} 
                  featured={suggestedOffer.featured}
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                >
                  View All Offers
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetails;
