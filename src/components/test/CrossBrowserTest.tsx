import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAnimationPreferences } from '../../hooks/useAnimationPreferences';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  RefreshCw,
  Eye,
  Palette,
  Zap,
  Settings,
  Database
} from 'lucide-react';

interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
  userAgent: string;
}

interface CompatibilityTest {
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'warning' | 'info';
  details: string;
  category: 'css' | 'js' | 'storage' | 'animation' | 'accessibility';
}

const CrossBrowserTest: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { shouldAnimate } = useAnimationPreferences();
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [compatibilityTests, setCompatibilityTests] = useState<CompatibilityTest[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  // Detect browser information
  useEffect(() => {
    const detectBrowser = () => {
      const ua = navigator.userAgent;
      let browserName = 'Unknown';
      let browserVersion = 'Unknown';
      let browserEngine = 'Unknown';
      
      // Detect browser
      if (ua.includes('Chrome') && !ua.includes('Edg')) {
        browserName = 'Chrome';
        const match = ua.match(/Chrome\/(\d+\.\d+)/);
        browserVersion = match ? match[1] : 'Unknown';
        browserEngine = 'Blink';
      } else if (ua.includes('Firefox')) {
        browserName = 'Firefox';
        const match = ua.match(/Firefox\/(\d+\.\d+)/);
        browserVersion = match ? match[1] : 'Unknown';
        browserEngine = 'Gecko';
      } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browserName = 'Safari';
        const match = ua.match(/Version\/(\d+\.\d+)/);
        browserVersion = match ? match[1] : 'Unknown';
        browserEngine = 'WebKit';
      } else if (ua.includes('Edg')) {
        browserName = 'Edge';
        const match = ua.match(/Edg\/(\d+\.\d+)/);
        browserVersion = match ? match[1] : 'Unknown';
        browserEngine = 'Blink';
      }
      
      setBrowserInfo({
        name: browserName,
        version: browserVersion,
        engine: browserEngine,
        platform: navigator.platform,
        mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        userAgent: ua
      });
    };

    const detectDevice = () => {
      setDeviceInfo({
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        orientation: window.screen.orientation?.type || 'unknown',
        touchSupport: 'ontouchstart' in window,
        cookieEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        language: navigator.language,
        languages: navigator.languages,
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        maxTouchPoints: navigator.maxTouchPoints || 0
      });
    };

    detectBrowser();
    detectDevice();
  }, []);

  const runCompatibilityTests = async () => {
    setIsRunningTests(true);
    const tests: CompatibilityTest[] = [];

    // CSS Features Tests
    tests.push({
      name: 'CSS Custom Properties',
      description: 'Support for CSS variables (--property)',
      status: CSS.supports('color', 'var(--test)') ? 'passed' : 'failed',
      details: CSS.supports('color', 'var(--test)') 
        ? 'CSS custom properties are supported' 
        : 'CSS custom properties are not supported',
      category: 'css'
    });

    tests.push({
      name: 'CSS Grid Layout',
      description: 'Support for CSS Grid',
      status: CSS.supports('display', 'grid') ? 'passed' : 'failed',
      details: CSS.supports('display', 'grid') 
        ? 'CSS Grid is supported' 
        : 'CSS Grid is not supported',
      category: 'css'
    });

    tests.push({
      name: 'CSS Flexbox',
      description: 'Support for CSS Flexbox',
      status: CSS.supports('display', 'flex') ? 'passed' : 'failed',
      details: CSS.supports('display', 'flex') 
        ? 'CSS Flexbox is supported' 
        : 'CSS Flexbox is not supported',
      category: 'css'
    });

    tests.push({
      name: 'CSS Transitions',
      description: 'Support for CSS transitions',
      status: CSS.supports('transition', 'all 0.3s ease') ? 'passed' : 'failed',
      details: CSS.supports('transition', 'all 0.3s ease') 
        ? 'CSS transitions are supported' 
        : 'CSS transitions are not supported',
      category: 'css'
    });

    tests.push({
      name: 'CSS Transforms',
      description: 'Support for CSS transforms',
      status: CSS.supports('transform', 'translateX(10px)') ? 'passed' : 'failed',
      details: CSS.supports('transform', 'translateX(10px)') 
        ? 'CSS transforms are supported' 
        : 'CSS transforms are not supported',
      category: 'css'
    });

    // JavaScript Features Tests
    tests.push({
      name: 'ES6 Classes',
      description: 'Support for ES6 class syntax',
      status: 'passed',
      details: 'ES6 classes are supported (code is running)',
      category: 'js'
    });

    tests.push({
      name: 'Arrow Functions',
      description: 'Support for ES6 arrow functions',
      status: 'passed',
      details: 'Arrow functions are supported (code is running)',
      category: 'js'
    });

    tests.push({
      name: 'Template Literals',
      description: 'Support for ES6 template literals',
      status: 'passed',
      details: 'Template literals are supported (code is running)',
      category: 'js'
    });

    tests.push({
      name: 'Async/Await',
      description: 'Support for async/await syntax',
      status: 'passed',
      details: 'Async/await is supported (code is running)',
      category: 'js'
    });

    // Storage Tests
    tests.push({
      name: 'localStorage',
      description: 'Support for localStorage API',
      status: typeof Storage !== 'undefined' && window.localStorage ? 'passed' : 'failed',
      details: typeof Storage !== 'undefined' && window.localStorage 
        ? 'localStorage is supported and available' 
        : 'localStorage is not supported',
      category: 'storage'
    });

    tests.push({
      name: 'sessionStorage',
      description: 'Support for sessionStorage API',
      status: typeof Storage !== 'undefined' && window.sessionStorage ? 'passed' : 'failed',
      details: typeof Storage !== 'undefined' && window.sessionStorage 
        ? 'sessionStorage is supported and available' 
        : 'sessionStorage is not supported',
      category: 'storage'
    });

    // Test localStorage functionality
    try {
      const testKey = 'cross-browser-test';
      const testValue = 'test-value';
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      tests.push({
        name: 'localStorage Functionality',
        description: 'localStorage read/write operations',
        status: retrieved === testValue ? 'passed' : 'failed',
        details: retrieved === testValue 
          ? 'localStorage read/write operations work correctly' 
          : 'localStorage read/write operations failed',
        category: 'storage'
      });
    } catch (error) {
      tests.push({
        name: 'localStorage Functionality',
        description: 'localStorage read/write operations',
        status: 'failed',
        details: `localStorage operations failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        category: 'storage'
      });
    }

    // Animation Tests
    tests.push({
      name: 'requestAnimationFrame',
      description: 'Support for requestAnimationFrame API',
      status: typeof requestAnimationFrame === 'function' ? 'passed' : 'failed',
      details: typeof requestAnimationFrame === 'function' 
        ? 'requestAnimationFrame is supported' 
        : 'requestAnimationFrame is not supported',
      category: 'animation'
    });

    tests.push({
      name: 'Web Animations API',
      description: 'Support for Web Animations API',
      status: typeof Element !== 'undefined' && Element.prototype.animate ? 'passed' : 'warning',
      details: typeof Element !== 'undefined' && Element.prototype.animate 
        ? 'Web Animations API is supported' 
        : 'Web Animations API is not supported (fallback to CSS animations)',
      category: 'animation'
    });

    // Accessibility Tests
    tests.push({
      name: 'prefers-reduced-motion',
      description: 'Support for prefers-reduced-motion media query',
      status: window.matchMedia ? 'passed' : 'failed',
      details: window.matchMedia 
        ? `prefers-reduced-motion is ${window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'enabled' : 'disabled'}` 
        : 'matchMedia API is not supported',
      category: 'accessibility'
    });

    tests.push({
      name: 'prefers-color-scheme',
      description: 'Support for prefers-color-scheme media query',
      status: window.matchMedia ? 'passed' : 'failed',
      details: window.matchMedia 
        ? `prefers-color-scheme is ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}` 
        : 'matchMedia API is not supported',
      category: 'accessibility'
    });

    tests.push({
      name: 'Focus Management',
      description: 'Support for focus management APIs',
      status: typeof document.activeElement !== 'undefined' ? 'passed' : 'failed',
      details: typeof document.activeElement !== 'undefined' 
        ? 'Focus management APIs are supported' 
        : 'Focus management APIs are not supported',
      category: 'accessibility'
    });

    // Performance Tests
    tests.push({
      name: 'Performance API',
      description: 'Support for Performance API',
      status: typeof performance !== 'undefined' && performance.now ? 'passed' : 'warning',
      details: typeof performance !== 'undefined' && performance.now 
        ? 'Performance API is supported' 
        : 'Performance API is not supported (using Date.now() fallback)',
      category: 'js'
    });

    // Theme-specific tests
    const testElement = document.createElement('div');
    testElement.style.setProperty('--test-var', '#000000');
    const computedStyle = getComputedStyle(testElement);
    const supportsCustomProps = computedStyle.getPropertyValue('--test-var') === '#000000';
    
    tests.push({
      name: 'Theme System Compatibility',
      description: 'CSS custom properties for theming',
      status: supportsCustomProps ? 'passed' : 'failed',
      details: supportsCustomProps 
        ? 'Theme system is fully compatible' 
        : 'Theme system may have limited functionality',
      category: 'css'
    });

    setCompatibilityTests(tests);
    setIsRunningTests(false);
  };

  useEffect(() => {
    if (browserInfo) {
      runCompatibilityTests();
    }
  }, [browserInfo]);

  const getStatusIcon = (status: CompatibilityTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: CompatibilityTest['category']) => {
    switch (category) {
      case 'css':
        return <Palette className="w-4 h-4" />;
      case 'js':
        return <Zap className="w-4 h-4" />;
      case 'storage':
        return <Database className="w-4 h-4" />;
      case 'animation':
        return <RefreshCw className="w-4 h-4" />;
      case 'accessibility':
        return <Eye className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = () => {
    if (!browserInfo) return <Monitor className="w-5 h-5" />;
    if (browserInfo.mobile) {
      return deviceInfo?.screenWidth > 768 ? <Tablet className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  const groupedTests = compatibilityTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, CompatibilityTest[]>);

  const getOverallStatus = () => {
    const failed = compatibilityTests.filter(t => t.status === 'failed').length;
    const warnings = compatibilityTests.filter(t => t.status === 'warning').length;
    const passed = compatibilityTests.filter(t => t.status === 'passed').length;
    
    if (failed > 0) return { status: 'failed', color: 'text-red-500' };
    if (warnings > 0) return { status: 'warning', color: 'text-yellow-500' };
    return { status: 'passed', color: 'text-green-500' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Cross-Browser Compatibility Test</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive testing for theme system compatibility across different browsers and devices
          </p>
        </motion.div>

        {/* Browser Information */}
        {browserInfo && (
          <motion.div 
            className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
            layout
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {getDeviceIcon()}
              Browser & Device Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Browser Details
                </h3>
                <ul className="text-sm space-y-1">
                  <li>Name: <strong>{browserInfo.name}</strong></li>
                  <li>Version: <strong>{browserInfo.version}</strong></li>
                  <li>Engine: <strong>{browserInfo.engine}</strong></li>
                  <li>Platform: <strong>{browserInfo.platform}</strong></li>
                  <li>Mobile: <strong>{browserInfo.mobile ? 'Yes' : 'No'}</strong></li>
                </ul>
              </div>
              
              {deviceInfo && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">Display Information</h3>
                  <ul className="text-sm space-y-1">
                    <li>Screen: <strong>{deviceInfo.screenWidth}×{deviceInfo.screenHeight}</strong></li>
                    <li>Viewport: <strong>{deviceInfo.viewportWidth}×{deviceInfo.viewportHeight}</strong></li>
                    <li>Pixel Ratio: <strong>{deviceInfo.devicePixelRatio}</strong></li>
                    <li>Color Depth: <strong>{deviceInfo.colorDepth}-bit</strong></li>
                    <li>Touch Support: <strong>{deviceInfo.touchSupport ? 'Yes' : 'No'}</strong></li>
                  </ul>
                </div>
              )}
              
              {deviceInfo && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">System Information</h3>
                  <ul className="text-sm space-y-1">
                    <li>Language: <strong>{deviceInfo.language}</strong></li>
                    <li>Online: <strong>{deviceInfo.onlineStatus ? 'Yes' : 'No'}</strong></li>
                    <li>Cookies: <strong>{deviceInfo.cookieEnabled ? 'Enabled' : 'Disabled'}</strong></li>
                    <li>CPU Cores: <strong>{deviceInfo.hardwareConcurrency}</strong></li>
                    <li>Max Touch Points: <strong>{deviceInfo.maxTouchPoints}</strong></li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Overall Status */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4">Compatibility Overview</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`text-2xl font-bold ${overallStatus.color}`}>
              {overallStatus.status.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {compatibilityTests.filter(t => t.status === 'passed').length} passed, 
              {compatibilityTests.filter(t => t.status === 'warning').length} warnings, 
              {compatibilityTests.filter(t => t.status === 'failed').length} failed
            </div>
          </div>
          
          <button
            onClick={runCompatibilityTests}
            disabled={isRunningTests}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {isRunningTests ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isRunningTests ? 'Running Tests...' : 'Re-run Tests'}
          </button>
        </motion.div>

        {/* Test Results by Category */}
        <div className="space-y-6">
          {Object.entries(groupedTests).map(([category, tests]) => (
            <motion.div 
              key={category}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
              layout
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 capitalize">
                {getCategoryIcon(category as CompatibilityTest['category'])}
                {category} Features
              </h3>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {tests.map((test, index) => (
                    <motion.div
                      key={`${category}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        test.status === 'passed' 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
                          : test.status === 'failed'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                          : test.status === 'warning'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className="font-medium">{test.name}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {test.description}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {test.details}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Theme Demo Section */}
        <motion.div 
          className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h3 className="text-lg font-semibold mb-4">Live Theme Demo</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Test theme switching functionality in your current browser
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200"
            >
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </button>
            
            <div className="text-sm">
              Current theme: <strong className="capitalize">{theme}</strong>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded transition-colors duration-300">
            <p className="text-sm">
              This section demonstrates theme transitions. The background and text colors should change smoothly when switching themes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CrossBrowserTest;