import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useAnimationPreferences } from '../../hooks/useAnimationPreferences';
import { 
  Zap, 
  Clock, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Play, 
  Pause, 
  Square,
  Monitor,
  Cpu,
  HardDrive,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'poor';
  threshold: { good: number; warning: number };
  description: string;
}

interface PerformanceTest {
  name: string;
  description: string;
  duration: number;
  iterations: number;
  results: {
    min: number;
    max: number;
    avg: number;
    median: number;
  };
  status: 'good' | 'warning' | 'poor';
}

interface SystemInfo {
  userAgent: string;
  platform: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

const PerformanceTest: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { shouldAnimate } = useAnimationPreferences();
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [performanceTests, setPerformanceTests] = useState<PerformanceTest[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  
  const animationRef = useRef<HTMLDivElement>(null);
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);
  const performanceObserver = useRef<PerformanceObserver | null>(null);

  // Get system information
  useEffect(() => {
    const getSystemInfo = () => {
      const nav = navigator as any;
      const info: SystemInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency || 1,
      };
      
      if ('deviceMemory' in navigator) {
        info.deviceMemory = nav.deviceMemory;
      }
      
      if ('connection' in navigator) {
        const conn = nav.connection;
        info.connection = {
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt
        };
      }
      
      setSystemInfo(info);
    };
    
    getSystemInfo();
  }, []);

  // Performance monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    
    // Monitor frame rate and performance
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        // Update real-time metrics
        setRealTimeMetrics(prev => ({
          ...prev,
          fps,
          timestamp: new Date().toLocaleTimeString()
        }));
      }
      
      if (isMonitoring) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    requestAnimationFrame(measureFPS);
    
    // Monitor memory usage (if available)
    monitoringInterval.current = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setRealTimeMetrics(prev => ({
          ...prev,
          memory: {
            used: Math.round(memory.usedJSHeapSize / 1048576), // MB
            total: Math.round(memory.totalJSHeapSize / 1048576), // MB
            limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
          }
        }));
      }
    }, 1000);
    
    // Performance Observer for paint timing
    if ('PerformanceObserver' in window) {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            setRealTimeMetrics(prev => ({
              ...prev,
              paintTiming: {
                ...prev?.paintTiming,
                [entry.name]: entry.startTime
              }
            }));
          }
        });
      });
      
      try {
        performanceObserver.current.observe({ entryTypes: ['paint', 'measure'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported');
      }
    }
  }, [isMonitoring]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
    }
    
    if (performanceObserver.current) {
      performanceObserver.current.disconnect();
    }
  }, []);

  // Theme switching performance test
  const testThemeSwitchingPerformance = async (): Promise<PerformanceTest> => {
    const iterations = 20;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Trigger theme switch
      toggleTheme();
      
      // Wait for DOM updates
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
      
      const endTime = performance.now();
      times.push(endTime - startTime);
      
      setTestProgress((i + 1) / iterations * 25); // 25% of total progress
    }
    
    const sortedTimes = times.sort((a, b) => a - b);
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
    
    return {
      name: 'Theme Switching',
      description: 'Time to complete theme transitions',
      duration: avg,
      iterations,
      results: {
        min: Math.min(...times),
        max: Math.max(...times),
        avg,
        median
      },
      status: avg < 50 ? 'good' : avg < 100 ? 'warning' : 'poor'
    };
  };

  // Animation performance test
  const testAnimationPerformance = async (): Promise<PerformanceTest> => {
    const iterations = 10;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Trigger animation
      if (animationRef.current) {
        animationRef.current.style.transform = `translateX(${i % 2 === 0 ? '100px' : '0px'})`;
      }
      
      // Wait for animation frame
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
      
      const endTime = performance.now();
      times.push(endTime - startTime);
      
      setTestProgress(25 + (i + 1) / iterations * 25); // 25-50% of total progress
    }
    
    const sortedTimes = times.sort((a, b) => a - b);
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
    
    return {
      name: 'Animation Performance',
      description: 'Time to render animation frames',
      duration: avg,
      iterations,
      results: {
        min: Math.min(...times),
        max: Math.max(...times),
        avg,
        median
      },
      status: avg < 16.67 ? 'good' : avg < 33.33 ? 'warning' : 'poor' // 60fps = 16.67ms, 30fps = 33.33ms
    };
  };

  // DOM manipulation performance test
  const testDOMPerformance = async (): Promise<PerformanceTest> => {
    const iterations = 100;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Create and manipulate DOM elements
      const element = document.createElement('div');
      element.className = 'test-element';
      element.style.cssText = `
        width: 100px;
        height: 100px;
        background-color: ${theme === 'light' ? '#000' : '#fff'};
        transition: all 0.3s ease;
      `;
      
      document.body.appendChild(element);
      
      // Force reflow
      element.offsetHeight;
      
      // Remove element
      document.body.removeChild(element);
      
      const endTime = performance.now();
      times.push(endTime - startTime);
      
      setTestProgress(50 + (i + 1) / iterations * 25); // 50-75% of total progress
    }
    
    const sortedTimes = times.sort((a, b) => a - b);
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
    
    return {
      name: 'DOM Manipulation',
      description: 'Time to create, style, and remove DOM elements',
      duration: avg,
      iterations,
      results: {
        min: Math.min(...times),
        max: Math.max(...times),
        avg,
        median
      },
      status: avg < 1 ? 'good' : avg < 5 ? 'warning' : 'poor'
    };
  };

  // CSS performance test
  const testCSSPerformance = async (): Promise<PerformanceTest> => {
    const iterations = 50;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Test CSS custom property updates
      document.documentElement.style.setProperty('--test-color', `hsl(${i * 7}, 50%, 50%)`);
      document.documentElement.style.setProperty('--test-size', `${10 + i}px`);
      
      // Force style recalculation
      getComputedStyle(document.documentElement).getPropertyValue('--test-color');
      
      const endTime = performance.now();
      times.push(endTime - startTime);
      
      setTestProgress(75 + (i + 1) / iterations * 25); // 75-100% of total progress
    }
    
    // Cleanup
    document.documentElement.style.removeProperty('--test-color');
    document.documentElement.style.removeProperty('--test-size');
    
    const sortedTimes = times.sort((a, b) => a - b);
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
    
    return {
      name: 'CSS Custom Properties',
      description: 'Time to update CSS custom properties',
      duration: avg,
      iterations,
      results: {
        min: Math.min(...times),
        max: Math.max(...times),
        avg,
        median
      },
      status: avg < 0.5 ? 'good' : avg < 2 ? 'warning' : 'poor'
    };
  };

  const runPerformanceTests = async () => {
    setIsRunningTests(true);
    setTestProgress(0);
    
    try {
      const tests: PerformanceTest[] = [];
      
      // Run individual tests
      tests.push(await testThemeSwitchingPerformance());
      tests.push(await testAnimationPerformance());
      tests.push(await testDOMPerformance());
      tests.push(await testCSSPerformance());
      
      setPerformanceTests(tests);
      
      // Calculate overall metrics
      const metrics: PerformanceMetric[] = [
        {
          name: 'Theme Switch Time',
          value: tests[0].results.avg,
          unit: 'ms',
          status: tests[0].results.avg < 50 ? 'good' : tests[0].results.avg < 100 ? 'warning' : 'poor',
          threshold: { good: 50, warning: 100 },
          description: 'Average time to complete theme transitions'
        },
        {
          name: 'Animation Frame Time',
          value: tests[1].results.avg,
          unit: 'ms',
          status: tests[1].results.avg < 16.67 ? 'good' : tests[1].results.avg < 33.33 ? 'warning' : 'poor',
          threshold: { good: 16.67, warning: 33.33 },
          description: 'Time per animation frame (60fps = 16.67ms)'
        },
        {
          name: 'DOM Manipulation',
          value: tests[2].results.avg,
          unit: 'ms',
          status: tests[2].results.avg < 1 ? 'good' : tests[2].results.avg < 5 ? 'warning' : 'poor',
          threshold: { good: 1, warning: 5 },
          description: 'Time to create and manipulate DOM elements'
        },
        {
          name: 'CSS Property Updates',
          value: tests[3].results.avg,
          unit: 'ms',
          status: tests[3].results.avg < 0.5 ? 'good' : tests[3].results.avg < 2 ? 'warning' : 'poor',
          threshold: { good: 0.5, warning: 2 },
          description: 'Time to update CSS custom properties'
        }
      ];
      
      // Add memory metrics if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        metrics.push({
          name: 'Memory Usage',
          value: Math.round(memory.usedJSHeapSize / 1048576),
          unit: 'MB',
          status: memory.usedJSHeapSize < 50 * 1048576 ? 'good' : memory.usedJSHeapSize < 100 * 1048576 ? 'warning' : 'poor',
          threshold: { good: 50, warning: 100 },
          description: 'Current JavaScript heap memory usage'
        });
      }
      
      setPerformanceMetrics(metrics);
      
    } catch (error) {
      console.error('Performance test error:', error);
    } finally {
      setIsRunningTests(false);
      setTestProgress(100);
    }
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return (
    <div className="min-h-screen p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Performance Testing Suite</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive performance testing for theme switching and animations
          </p>
        </motion.div>

        {/* System Information */}
        {systemInfo && (
          <motion.div 
            className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
            layout
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              System Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Hardware
                </h3>
                <ul className="text-sm space-y-1">
                  <li>CPU Cores: <strong>{systemInfo.hardwareConcurrency}</strong></li>
                  {systemInfo.deviceMemory && (
                    <li>Device Memory: <strong>{systemInfo.deviceMemory} GB</strong></li>
                  )}
                  <li>Platform: <strong>{systemInfo.platform}</strong></li>
                </ul>
              </div>
              
              {systemInfo.connection && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">Network</h3>
                  <ul className="text-sm space-y-1">
                    <li>Type: <strong>{systemInfo.connection.effectiveType}</strong></li>
                    <li>Downlink: <strong>{systemInfo.connection.downlink} Mbps</strong></li>
                    <li>RTT: <strong>{systemInfo.connection.rtt} ms</strong></li>
                  </ul>
                </div>
              )}
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Browser</h3>
                <p className="text-sm break-all">{systemInfo.userAgent}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Real-time Monitoring */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-time Performance Monitoring
          </h2>
          
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`px-4 py-2 rounded transition-colors duration-200 flex items-center gap-2 ${
                isMonitoring 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
          </div>
          
          {realTimeMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Frame Rate</h3>
                <div className="text-2xl font-bold">{realTimeMetrics.fps || 0} FPS</div>
                <div className="text-sm text-gray-500">Target: 60 FPS</div>
              </div>
              
              {realTimeMetrics.memory && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Memory
                  </h3>
                  <div className="text-lg font-bold">{realTimeMetrics.memory.used} MB</div>
                  <div className="text-sm text-gray-500">of {realTimeMetrics.memory.total} MB</div>
                </div>
              )}
              
              {realTimeMetrics.paintTiming && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-semibold mb-2">Paint Timing</h3>
                  {realTimeMetrics.paintTiming['first-paint'] && (
                    <div className="text-sm">
                      First Paint: <strong>{realTimeMetrics.paintTiming['first-paint'].toFixed(2)}ms</strong>
                    </div>
                  )}
                  {realTimeMetrics.paintTiming['first-contentful-paint'] && (
                    <div className="text-sm">
                      FCP: <strong>{realTimeMetrics.paintTiming['first-contentful-paint'].toFixed(2)}ms</strong>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Last Update</h3>
                <div className="text-sm">{realTimeMetrics.timestamp || 'Not started'}</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Test Controls */}
        <motion.div 
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
          layout
        >
          <h2 className="text-xl font-semibold mb-4">Performance Tests</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={runPerformanceTests}
              disabled={isRunningTests}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {isRunningTests ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Gauge className="w-4 h-4" />
              )}
              {isRunningTests ? 'Running Tests...' : 'Run Performance Tests'}
            </button>
          </div>
          
          {isRunningTests && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Test Progress</span>
                <span className="text-sm text-gray-500">{Math.round(testProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${testProgress}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Performance Metrics */}
        {performanceMetrics.length > 0 && (
          <motion.div 
            className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
            layout
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{metric.name}</h3>
                    {getStatusIcon(metric.status)}
                  </div>
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(2)} {metric.unit}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {metric.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Good: &lt; {metric.threshold.good}{metric.unit} | 
                    Warning: &lt; {metric.threshold.warning}{metric.unit}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Test Results */}
        {performanceTests.length > 0 && (
          <motion.div 
            className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300"
            layout
          >
            <h2 className="text-xl font-semibold mb-4">Detailed Test Results</h2>
            
            <div className="space-y-4">
              {performanceTests.map((test, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      {test.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {test.iterations} iterations
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {test.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Min:</span>
                      <div className="font-semibold">{test.results.min.toFixed(2)}ms</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Max:</span>
                      <div className="font-semibold">{test.results.max.toFixed(2)}ms</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Average:</span>
                      <div className={`font-semibold ${getStatusColor(test.status)}`}>
                        {test.results.avg.toFixed(2)}ms
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Median:</span>
                      <div className="font-semibold">{test.results.median.toFixed(2)}ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Test Animation Element */}
        <div 
          ref={animationRef}
          className="hidden w-4 h-4 bg-blue-500 transition-transform duration-300"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default PerformanceTest;