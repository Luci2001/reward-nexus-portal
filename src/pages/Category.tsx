
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OfferCard from '@/components/OfferCard';
import { useArticlesData } from '@/utils/jsonDataManager';
import { useState } from 'react';

interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  reward: string;
  featured: boolean;
  trending: boolean;
  points: number;
  estimatedTime: string;
}

interface Category {
  id: string;
  name: string;
  nameAr?: string;
  icon: string;
  description: string;
  descriptionAr?: string;
}

const Category = () => {
  const { category } = useParams();
  const { data: articlesData, loading, error } = useArticlesData();
  const [sortBy, setSortBy] = useState('featured');

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
          <p>Error loading data: {error}</p>
          <Link to="/" className="mt-4 inline-block">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const offers = articlesData?.offers?.filter((offer: Offer) => offer.category === category) || [];
  const categoryInfo = articlesData?.categories?.find((cat: Category) => cat.id === category);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortedOffers = [...offers].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      case 'points-high':
        return b.points - a.points;
      case 'points-low':
        return a.points - b.points;
      case 'newest':
        return parseInt(b.id) - parseInt(a.id);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {categoryInfo.name} Offers
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {categoryInfo.description}
          </p>
          <div className="mt-6 text-gray-400">
            <span className="text-blue-400 font-semibold">{offers.length}</span> offers available
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm">Sort by:</span>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="featured">Featured First</SelectItem>
              <SelectItem value="trending">Trending First</SelectItem>
              <SelectItem value="points-high">Highest Points</SelectItem>
              <SelectItem value="points-low">Lowest Points</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Offers Grid */}
        {sortedOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No offers available in this category yet.</div>
            <Link to="/" className="mt-4 inline-block">
              <Button variant="outline">Browse Other Categories</Button>
            </Link>
          </div>
        )}

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

export default Category;
