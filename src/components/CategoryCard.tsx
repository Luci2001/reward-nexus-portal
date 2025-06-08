
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Gift, Gamepad2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'wrench': return Wrench;
      case 'gift': return Gift;
      case 'gamepad-2': return Gamepad2;
      default: return Gift;
    }
  };

  const getGradient = (categoryId: string) => {
    switch (categoryId) {
      case 'tools': return 'from-blue-500 to-cyan-500';
      case 'gifts': return 'from-purple-500 to-pink-500';
      case 'games': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const IconComponent = getIcon(category.icon);

  return (
    <Link to={`/category/${category.id}`}>
      <Card className="group overflow-hidden bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 cursor-pointer">
        <CardContent className="p-8 text-center">
          <div className={cn(
            "w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg",
            getGradient(category.id)
          )}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200">
            {category.name}
          </h3>
          
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {category.description}
          </p>
          
          <div className="flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
            <span className="text-sm font-medium mr-2">Explore Offers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
