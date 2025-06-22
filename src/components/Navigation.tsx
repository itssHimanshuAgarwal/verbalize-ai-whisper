
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Linkedin } from 'lucide-react';

interface NavigationProps {
  onSignInClick: () => void;
}

export const Navigation = ({ onSignInClick }: NavigationProps) => {
  const { user } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Verbalize AI
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('team')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Team
            </button>
            <a 
              href="https://www.linkedin.com/in/himanshu-ragarwal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              Connect
            </a>
          </div>

          {/* Auth Section */}
          <div className="flex items-center">
            {user ? (
              <UserMenu />
            ) : (
              <Button 
                onClick={onSignInClick} 
                variant="outline"
                className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300 transition-all duration-300"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
