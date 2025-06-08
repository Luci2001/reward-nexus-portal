
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, TrendingUp, Gift, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  reward: string;
  featured?: boolean;
  trending?: boolean;
  points: number;
  estimatedTime: string;
}

interface OfferCardProps {
  offer: Offer;
  featured?: boolean;
}

const OfferCard = ({ offer, featured = false }: OfferCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tools': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'gifts': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'games': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Card className={cn(
      "group overflow-hidden bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10",
      featured && "ring-2 ring-blue-500/20 shadow-xl shadow-blue-500/10"
    )}>
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {offer.featured && (
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {offer.trending && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={getCategoryColor(offer.category)}>
            {offer.category}
          </Badge>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-200 line-clamp-2">
              {offer.title}
            </h3>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
              {offer.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{offer.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gift className="w-4 h-4" />
                <span>{offer.points} pts</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Reward:</p>
                <p className="text-blue-300 font-medium text-sm">{offer.reward}</p>
              </div>
              <Link to={`/offer/${offer.id}`}>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group/btn"
                >
                  Claim Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCard;
