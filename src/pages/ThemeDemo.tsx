import React, { useState } from 'react';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { ThemeCustomizer } from '../components/theme/ThemeCustomizer';
import { ThemeSettings } from '../components/theme/ThemeSettings';
import { useTheme } from '../hooks/useTheme';
import { useThemePresets } from '../hooks/useThemePresets';
import { useThemeTransitions } from '../hooks/useThemeTransitions';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useAnimationPreferences } from '../hooks/useAnimationPreferences';
import { 
  Palette, 
  Settings, 
  Zap, 
  Eye, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  Moon,
  Sun,

  Play,
  Pause
} from 'lucide-react';

const ThemeDemo: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const { presets, currentPreset, applyPreset, addPreset } = useThemePresets();
  const { executeTransition, isTransitioning, setPreset: setTransitionPreset } = useThemeTransitions();
  const { preferences, updatePreferences, exportPreferences, importPreferences, resetPreferences } = useUserPreferences();
  const { preferences: animationPreferences, setPreferences: updateAnimationPreferences } = useAnimationPreferences();
  
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [demoColors, setDemoColors] = useState({
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#8b5cf6'
  });

  // Demo transition effects
  const handleTransitionDemo = async (preset: string) => {
    setTransitionPreset(preset as any);
    await executeTransition(() => {
      // Toggle theme for demo
      setTheme(actualTheme === 'light' ? 'dark' : 'light');
    });
  };

  // Demo preset creation
  const handleCreateDemoPreset = () => {
    addPreset({
      id: `demo-preset-${Date.now()}`,
      name: `Demo Preset ${Date.now()}`,
      displayName: `Demo Preset ${Date.now()}`,
      description: 'A demo preset created from current settings',
      light: {
        name: 'demo-light',
        displayName: 'Demo Light',
        description: 'Demo light theme',
        colors: {
          primary: demoColors.primary,
          primaryForeground: '#ffffff',
          primaryHover: demoColors.primary,
          primaryActive: demoColors.primary,
          secondary: demoColors.secondary,
          secondaryForeground: '#ffffff',
          secondaryHover: demoColors.secondary,
          secondaryActive: demoColors.secondary,
          accent: demoColors.accent,
          accentForeground: '#ffffff',
          accentHover: demoColors.accent,
          accentActive: demoColors.accent,
          background: '#ffffff',
          backgroundSecondary: '#f9fafb',
          backgroundTertiary: '#f3f4f6',
          backgroundHover: '#f9fafb',
          foreground: '#111827',
          foregroundSecondary: '#6b7280',
          foregroundMuted: '#9ca3af',
          foregroundDisabled: '#d1d5db',
          border: '#e5e7eb',
          borderSecondary: '#d1d5db',
          borderHover: '#9ca3af',
          borderFocus: demoColors.primary,
          success: '#10b981',
          successForeground: '#ffffff',
          warning: '#f59e0b',
          warningForeground: '#ffffff',
          error: '#ef4444',
          errorForeground: '#ffffff',
          info: '#06b6d4',
          infoForeground: '#ffffff',
          shadow: 'rgba(0, 0, 0, 0.1)',
          overlay: 'rgba(0, 0, 0, 0.5)',
          highlight: '#fef3c7',
          selection: '#dbeafe'
        }
      },
      dark: {
        name: 'demo-dark',
        displayName: 'Demo Dark',
        description: 'Demo dark theme',
        colors: {
          primary: demoColors.primary,
          primaryForeground: '#ffffff',
          primaryHover: demoColors.primary,
          primaryActive: demoColors.primary,
          secondary: demoColors.secondary,
          secondaryForeground: '#ffffff',
          secondaryHover: demoColors.secondary,
          secondaryActive: demoColors.secondary,
          accent: demoColors.accent,
          accentForeground: '#ffffff',
          accentHover: demoColors.accent,
          accentActive: demoColors.accent,
          background: '#1f2937',
          backgroundSecondary: '#374151',
          backgroundTertiary: '#4b5563',
          backgroundHover: '#6b7280',
          foreground: '#f9fafb',
          foregroundSecondary: '#d1d5db',
          foregroundMuted: '#9ca3af',
          foregroundDisabled: '#6b7280',
          border: '#4b5563',
          borderSecondary: '#6b7280',
          borderHover: '#9ca3af',
          borderFocus: demoColors.primary,
          success: '#10b981',
          successForeground: '#ffffff',
          warning: '#f59e0b',
          warningForeground: '#ffffff',
          error: '#ef4444',
          errorForeground: '#ffffff',
          info: '#06b6d4',
          infoForeground: '#ffffff',
          shadow: 'rgba(0, 0, 0, 0.3)',
          overlay: 'rgba(0, 0, 0, 0.7)',
          highlight: '#374151',
          selection: '#1e40af'
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Advanced Theme System Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá các tính năng nâng cao của hệ thống theme bao gồm transitions, presets, 
            customization và user preferences management.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">Current Theme: {actualTheme}</Badge>
            <Badge variant="secondary">Preset: {currentPreset?.name || 'Default'}</Badge>
            {isTransitioning && <Badge variant="danger">Transitioning...</Badge>}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Các hành động nhanh để test theme system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => setTheme('light')} 
                variant={theme === 'light' ? 'primary' : 'outline'}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button 
                onClick={() => setTheme('dark')} 
                variant={theme === 'dark' ? 'primary' : 'outline'}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>

              <Button 
                onClick={() => setShowCustomizer(!showCustomizer)}
                variant={showCustomizer ? 'primary' : 'outline'}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Customize
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Demo Content */}
        <Tabs defaultValue="transitions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="transitions">Transitions</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="showcase">Showcase</TabsTrigger>
          </TabsList>

          {/* Transitions Demo */}
          <TabsContent value="transitions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Theme Transitions
                </CardTitle>
                <CardDescription>
                  Test các hiệu ứng chuyển đổi theme khác nhau
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => handleTransitionDemo('instant')}
                    variant="outline"
                    disabled={isTransitioning}
                  >
                    Instant
                  </Button>
                  <Button 
                    onClick={() => handleTransitionDemo('smooth')}
                    variant="outline"
                    disabled={isTransitioning}
                  >
                    Smooth
                  </Button>
                  <Button 
                    onClick={() => handleTransitionDemo('fade')}
                    variant="outline"
                    disabled={isTransitioning}
                  >
                    Fade
                  </Button>
                  <Button 
                    onClick={() => handleTransitionDemo('slide')}
                    variant="outline"
                    disabled={isTransitioning}
                  >
                    Slide
                  </Button>
                  <Button 
                    onClick={() => handleTransitionDemo('zoom')}
                    variant="outline"
                    disabled={isTransitioning}
                  >
                    Zoom
                  </Button>
                  <Button 
                    onClick={() => handleTransitionDemo('flip')}
                    variant="outline"
                    disabled={isTransitioning}
                  >
                    Flip
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Animation Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Animations Enabled:</span>
                      <Badge variant={animationPreferences.globalAnimationsEnabled ? 'default' : 'secondary'}>
                        {animationPreferences.globalAnimationsEnabled ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reduced Motion:</span>
                      <Badge variant={animationPreferences.respectReducedMotion ? 'default' : 'secondary'}>
                        {animationPreferences.respectReducedMotion ? 'Respected' : 'Ignored'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Duration Scale:</span>
                      <Badge variant="secondary">
                        1x
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Presets Demo */}
          <TabsContent value="presets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Presets
                </CardTitle>
                <CardDescription>
                  Quản lý và áp dụng các theme presets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {presets.slice(0, 6).map((preset) => (
                      <Card key={preset.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => applyPreset(preset.id)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{preset.name}</h4>
                            {currentPreset?.id === preset.id && (
                              <Badge variant="default">Active</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {preset.description}
                          </p>
                          <div className="flex gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: preset.light.colors.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: preset.light.colors.secondary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: preset.light.colors.accent }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleCreateDemoPreset} variant="outline">
                      Create Demo Preset
                    </Button>
                    <Button 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              try {
                                const data = JSON.parse(e.target?.result as string);
                                importPreferences(data);
                              } catch (error) {
                                console.error('Failed to import preset:', error);
                              }
                            };
                            reader.readAsText(file);
                          }
                        };
                        input.click();
                      }}
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button 
                      onClick={() => {
                        const data = exportPreferences();
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'theme-preferences.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customization Demo */}
          <TabsContent value="customization" className="space-y-6">
            {showCustomizer ? (
              <ThemeCustomizer isOpen={false} onClose={() => {}} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Theme Customization
                  </CardTitle>
                  <CardDescription>
                    Click "Customize" button above to open the theme customizer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Primary Color</label>
                        <input 
                          type="color" 
                          value={demoColors.primary}
                          onChange={(e) => setDemoColors(prev => ({ ...prev, primary: e.target.value }))}
                          className="w-full h-10 rounded border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Secondary Color</label>
                        <input 
                          type="color" 
                          value={demoColors.secondary}
                          onChange={(e) => setDemoColors(prev => ({ ...prev, secondary: e.target.value }))}
                          className="w-full h-10 rounded border"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Accent Color</label>
                        <input 
                          type="color" 
                          value={demoColors.accent}
                          onChange={(e) => setDemoColors(prev => ({ ...prev, accent: e.target.value }))}
                          className="w-full h-10 rounded border"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        document.documentElement.style.setProperty('--color-custom-primary', demoColors.primary);
                        document.documentElement.style.setProperty('--color-custom-secondary', demoColors.secondary);
                        document.documentElement.style.setProperty('--color-custom-accent', demoColors.accent);
                      }}
                    >
                      Apply Colors
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Preferences Demo */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                  <CardDescription>
                    Current user preferences settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Theme Preferences</h4>
                      <div className="text-sm space-y-1">
                        <div>Theme: {preferences.theme.theme}</div>
                        <div>Animations Enabled: {preferences.theme.animationsEnabled ? 'Yes' : 'No'}</div>
                        <div>High Contrast: {preferences.theme.highContrast ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Animation Preferences</h4>
                      <div className="text-sm space-y-1">
                        <div>Enabled: {preferences.animations.globalAnimationsEnabled ? 'Yes' : 'No'}</div>
                        <div>Reduced Motion: {preferences.animations.respectReducedMotion ? 'Yes' : 'No'}</div>
                        <div>Global Animations: {preferences.animations.globalAnimationsEnabled ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">UI Preferences</h4>
                      <div className="text-sm space-y-1">
                        <div>Density: {preferences.ui.layout.density}</div>
                        <div>Font Size: {preferences.theme.fontSize}</div>
                        <div>High Contrast: {preferences.ui.accessibility.highContrast ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preference Actions</CardTitle>
                  <CardDescription>
                    Manage your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      onClick={() => updateAnimationPreferences({ globalAnimationsEnabled: !animationPreferences.globalAnimationsEnabled })}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      {animationPreferences.globalAnimationsEnabled ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {animationPreferences.globalAnimationsEnabled ? 'Disable' : 'Enable'} Animations
                    </Button>
                    
                    <Button 
                      onClick={() => resetPreferences()}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                    
                    <ThemeSettings />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Showcase Demo */}
          <TabsContent value="showcase" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Cards with Different Styles */}
              <Card className="bg-custom-surface border-custom-border">
                <CardHeader>
                  <CardTitle className="text-custom-text">Custom Surface</CardTitle>
                  <CardDescription className="text-custom-textSecondary">
                    Using custom CSS variables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-2 bg-custom-primary rounded"></div>
                    <div className="h-2 bg-custom-secondary rounded"></div>
                    <div className="h-2 bg-custom-accent rounded"></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="theme-transition-fade">
                <CardHeader>
                  <CardTitle>Fade Transition</CardTitle>
                  <CardDescription>
                    This card uses fade transition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
                    className="w-full"
                  >
                    Toggle Theme
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="theme-transition-zoom">
                <CardHeader>
                  <CardTitle>Zoom Transition</CardTitle>
                  <CardDescription>
                    This card uses zoom transition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge className="bg-custom-primary text-white">Primary</Badge>
                    <Badge className="bg-custom-secondary text-white">Secondary</Badge>
                    <Badge className="bg-custom-accent text-white">Accent</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThemeDemo;