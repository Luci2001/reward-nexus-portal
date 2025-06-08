
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Gift, Star, CheckCircle, ExternalLink, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const loadOffer = async () => {
      try {
        const response = await fetch('/data/articles.json');
        const data = await response.json();
        const foundOffer = data.offers.find((o: Offer) => o.id === id);
        setOffer(foundOffer || null);
        
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
          <div className="lg:col-span-2">
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
                    
                    <h1 className="text-3xl font-bold text-white mb-4">
                      {offer.title}
                    </h1>
                    
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {offer.description}
                    </p>
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

                {/* Requirements */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Requirements</h3>
                  <ul className="space-y-3">
                    {offer.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {!hasCompleted ? (
                    <Button
                      onClick={handleStartOffer}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex-1"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Start Offer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleClaimReward}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Claim Reward
                    </Button>
                  )}
                  
                  {hasCompleted && (
                    <div className="flex items-center justify-center gap-2 text-green-400 flex-1">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Completed!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reward Info */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Reward Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Reward:</span>
                    <span className="text-blue-300 font-medium">{offer.reward}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Points:</span>
                    <span className="text-white font-medium">{offer.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white font-medium">{offer.estimatedTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
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
                    <span className="text-gray-300">High success rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
