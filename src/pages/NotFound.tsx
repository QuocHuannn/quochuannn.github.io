import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFound: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSearch = () => {
    const searchQuery = prompt('What are you looking for?');
    if (searchQuery) {
      // Handle search functionality
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative">
            <motion.h1
              className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              404
            </motion.h1>
            
            {/* Floating elements */}
            <motion.div
              className="absolute top-4 left-4 w-8 h-8 bg-blue-500/30 rounded-full"
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="absolute top-8 right-8 w-6 h-6 bg-purple-500/30 rounded-full"
              animate={{
                y: [10, -10, 10],
                rotate: [360, 180, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-500/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
            />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-400 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Page Not Found
            </h2>
          </div>
          <p className="text-lg text-gray-300 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-400">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <div className="backdrop-blur-lg rounded-2xl p-6 border" style={{backgroundColor: 'var(--color-bg-primary, rgba(255, 255, 255, 0.1))', borderColor: 'var(--color-border-primary, rgba(255, 255, 255, 0.2))'}}>
            <h3 className="text-xl font-semibold text-white mb-4">
              Here's what you can do:
            </h3>
            <ul className="text-gray-300 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Check the URL for typos
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                Go back to the previous page
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                Visit the homepage
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Search for what you need
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleGoHome}
            variant="primary"
            leftIcon={<Home className="w-4 h-4" />}
            className="min-w-[140px]"
          >
            Go Home
          </Button>
          <Button
            onClick={handleGoBack}
            variant="secondary"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="min-w-[140px]"
          >
            Go Back
          </Button>
          <Button
            onClick={handleSearch}
            variant="outline"
            leftIcon={<Search className="w-4 h-4" />}
            className="min-w-[140px]"
          >
            Search
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Error Code: 404 | Page Not Found
          </p>
          <p className="text-xs text-gray-600 mt-2">
            If you believe this is an error, please contact support.
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-10 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.3, 0.6]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;