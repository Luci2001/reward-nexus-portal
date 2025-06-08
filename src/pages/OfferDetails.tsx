
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Gift, Star, CheckCircle, ExternalLink, Share2, Users, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import OfferCard from '@/components/OfferCard';

interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  reward: string;
  offerUrl: string;
  completionUrl: string;
  featured: boolean;
  trending: boolean;
  points: number;
  estimatedTime: string;
  requirements: string[];
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
    
    // Redirect to reward
    window.open(offer.completionUrl, '_blank');
    
    toast({
      title: "Reward Claimed!",
      description: `You've successfully claimed: ${offer.reward}`,
    });
  };

  const handleShare = async () => {
    if (!offer) return;
    
    const shareData = {
      title: offer.title,
      text: `Check out this amazing offer: ${offer.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Offer link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
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
          <h1 className="text-2xl font-bold text-white mb-4">Offer Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          Back to Offers
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
                          Featured
                        </Badge>
                      )}
                      {offer.trending && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Trending
                        </Badge>
                      )}
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {offer.category}
                      </Badge>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                      {offer.title}
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
                    Amazing Opportunity
                  </h2>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    {offer.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold">Join Thousands</h3>
                      <p className="text-gray-400 text-sm">Users who claimed this offer</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold">100% Secure</h3>
                      <p className="text-gray-400 text-sm">Safe and verified process</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <Gift className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold">Instant Reward</h3>
                      <p className="text-gray-400 text-sm">Get your reward immediately</p>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    What You Need to Do
                  </h3>
                  <div className="grid gap-4">
                    {offer.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <span className="text-gray-200 text-lg">{requirement}</span>
                      </div>
                    ))}
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
                      Start This Amazing Offer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleClaimReward}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1 text-lg py-6"
                    >
                      <Gift className="w-6 h-6 mr-3" />
                      Claim Your Reward Now
                    </Button>
                  )}
                  
                  {hasCompleted && (
                    <div className="flex items-center justify-center gap-3 text-green-400 flex-1 text-lg">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-medium">Successfully Completed!</span>
                    </div>
                  )}
                </div>

                {/* Why Choose This Offer */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Why This Offer is Special</h3>
                  <ul className="space-y-3 text-gray-200">
                    <li className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-400" />
                      High success rate with instant rewards
                    </li>
                    <li className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-400" />
                      Verified and trusted by thousands of users
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-400" />
                      Quick completion in just {offer.estimatedTime}
                    </li>
                    <li className="flex items-center gap-3">
                      <Gift className="w-5 h-5 text-purple-400" />
                      Premium reward worth much more than the effort
                    </li>
                  </ul>
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
                  <Gift className="w-5 h-5 text-purple-400" />
                  Reward Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 font-bold text-xl mb-2">{offer.reward}</p>
                  <p className="text-gray-400 text-sm">Your Premium Reward</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Points Earned:</span>
                    <span className="text-white font-bold">{offer.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Completion Time:</span>
                    <span className="text-white font-medium">{offer.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Difficulty:</span>
                    <span className="text-green-400 font-medium">Easy</span>
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
