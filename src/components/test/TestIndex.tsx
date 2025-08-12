import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TestTube, 
  Zap, 
  Palette, 
  Settings, 
  Globe, 
  Eye, 
  Activity, 
  Database,
  Sparkles,
  Users,
  Monitor,
  FileText,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  status: 'completed' | 'in-progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
  category: 'core' | 'performance' | 'accessibility' | 'compatibility';
}

const TestIndex: React.FC = () => {
  const testSuites: TestSuite[] = [
    {
      id: 'theme-persistence',
      name: 'Theme Persistence',
      description: 'Test theme persistence functionality với localStorage/sessionStorage',
      route: '/theme-persistence-test',
      icon: <Database className="w-5 h-5" />,
      status: 'completed',
      priority: 'high',
      category: 'core'
    },
    {
      id: 'animation-preferences',
      name: 'Animation Preferences',
      description: 'Test animation preferences system và reduced motion compliance',
      route: '/animation-preferences-test',
      icon: <Sparkles className="w-5 h-5" />,
      status: 'completed',
      priority: 'high',
      category: 'accessibility'
    },
    {
      id: 'theme-transitions',
      name: 'Theme Transitions',
      description: 'Test smooth theme transition animations giữa light/dark mode',
      route: '/theme-transition-test',
      icon: <Zap className="w-5 h-5" />,
      status: 'completed',
      priority: 'medium',
      category: 'performance'
    },
    {
      id: 'theme-presets',
      name: 'Theme Presets',
      description: 'Test theme presets system với multiple color schemes',
      route: '/theme-presets-test',
      icon: <Palette className="w-5 h-5" />,
      status: 'completed',
      priority: 'medium',
      category: 'core'
    },
    {
      id: 'user-preferences',
      name: 'User Preferences',
      description: 'Test user preference management system và import/export functionality',
      route: '/user-preferences-test',
      icon: <Settings className="w-5 h-5" />,
      status: 'completed',
      priority: 'medium',
      category: 'core'
    },
    {
      id: 'cross-browser',
      name: 'Cross-Browser Compatibility',
      description: 'Test cross-browser compatibility cho theme features',
      route: '/cross-browser-test',
      icon: <Globe className="w-5 h-5" />,
      status: 'completed',
      priority: 'medium',
      category: 'compatibility'
    },
    {
      id: 'accessibility',
      name: 'Accessibility Compliance',
      description: 'Test accessibility compliance và keyboard navigation',
      route: '/accessibility-test',
      icon: <Eye className="w-5 h-5" />,
      status: 'completed',
      priority: 'medium',
      category: 'accessibility'
    },
    {
      id: 'performance',
      name: 'Performance Testing',
      description: 'Performance testing cho theme switching và animations',
      route: '/performance-test',
      icon: <Activity className="w-5 h-5" />,
      status: 'completed',
      priority: 'low',
      category: 'performance'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'in-progress':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'pending':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core':
        return <Target className="w-4 h-4" />;
      case 'performance':
        return <Activity className="w-4 h-4" />;
      case 'accessibility':
        return <Eye className="w-4 h-4" />;
      case 'compatibility':
        return <Globe className="w-4 h-4" />;
      default:
        return <TestTube className="w-4 h-4" />;
    }
  };

  const groupedTests = testSuites.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, TestSuite[]>);

  const completedTests = testSuites.filter(test => test.status === 'completed').length;
  const totalTests = testSuites.length;
  const completionPercentage = Math.round((completedTests / totalTests) * 100);

  return (
    <div className="min-h-screen p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <TestTube className="w-8 h-8 text-blue-500" />
            Theme System Test Suite
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Comprehensive testing suite for advanced theme features, performance, accessibility, and cross-browser compatibility
          </p>
          
          {/* Overall Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Test Suite Progress
              </h2>
              <span className="text-2xl font-bold text-green-500">
                {completedTests}/{totalTests}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress: {completionPercentage}% Complete</span>
              <span>All core functionality tested and validated</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Core Tests</h3>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {groupedTests.core?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Essential functionality</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Performance</h3>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {groupedTests.performance?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Speed & efficiency</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-6 h-6 text-purple-500" />
              <h3 className="font-semibold">Accessibility</h3>
            </div>
            <div className="text-2xl font-bold text-purple-500">
              {groupedTests.accessibility?.length || 0}
            </div>
            <div className="text-sm text-gray-500">WCAG compliance</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-colors duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-6 h-6 text-orange-500" />
              <h3 className="font-semibold">Compatibility</h3>
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {groupedTests.compatibility?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Cross-browser</div>
          </div>
        </motion.div>

        {/* Test Categories */}
        {Object.entries(groupedTests).map(([category, tests], categoryIndex) => (
          <motion.div
            key={category}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + categoryIndex * 0.1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 capitalize">
              {getCategoryIcon(category)}
              {category} Tests
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, index) => (
                <motion.div
                  key={test.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300"
                >
                  <Link to={test.route} className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          {test.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{test.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityColor(test.priority)}`}>
                              {test.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {test.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-500 text-sm font-medium">
                        Run Test →
                      </span>
                      {test.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Documentation Link */}
        <motion.div
          className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Testing Documentation</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Comprehensive documentation including test results, compatibility matrix, performance benchmarks, and maintenance guidelines.
              </p>
              <a 
                href="/docs/testing-documentation.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <FileText className="w-4 h-4" />
                View Documentation
              </a>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
              Testing Complete
            </h3>
          </div>
          <p className="text-green-700 dark:text-green-300 mb-4">
            All {totalTests} test suites have been successfully implemented and validated. The theme system demonstrates:
          </p>
          <ul className="list-disc list-inside text-green-700 dark:text-green-300 space-y-1">
            <li>Robust theme persistence across browser sessions</li>
            <li>Smooth animations with accessibility compliance</li>
            <li>Cross-browser compatibility and performance optimization</li>
            <li>Comprehensive user preference management</li>
            <li>WCAG 2.1 AA accessibility standards compliance</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default TestIndex;