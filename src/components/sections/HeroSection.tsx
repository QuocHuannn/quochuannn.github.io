import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Container from '../ui/Container';
import Button from '../ui/Button';
import OptimizedParallax from '../effects/OptimizedParallax';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';
import { PERSONAL_INFO } from '../../data/portfolio';
import { ChevronDown, ArrowRight } from 'lucide-react';

const HeroContent: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const backgroundStyles = {
    background: `
      linear-gradient(135deg, 
        var(--color-background) 0%, 
        var(--color-surface) 25%, 
        var(--color-surface-secondary) 50%, 
        var(--color-surface) 75%, 
        var(--color-background) 100%
      ),
      radial-gradient(circle at 20% 80%, var(--color-surface-glass) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, var(--color-primary-alpha) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, var(--color-secondary-alpha) 0%, transparent 50%)
    `
  };
  
  return (
    <section id="hero" className="relative overflow-hidden min-h-screen flex items-center justify-center pt-20 pb-24">
      {/* Gradient Background */}
      <div className="absolute inset-0" style={backgroundStyles} />
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 rounded-full blur-2xl opacity-60" style={{
          backgroundImage: 'linear-gradient(135deg, var(--color-primary-alpha) 0%, var(--color-secondary-alpha) 100%)'
        }} />
        <div className="absolute bottom-32 left-16 w-32 h-32 rounded-full blur-xl opacity-60" style={{
          backgroundImage: 'linear-gradient(135deg, var(--color-secondary-alpha) 0%, var(--color-primary-alpha) 100%)'
        }} />
      </div>
      
      <Container size="xl" padding="md" className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ y, opacity }}
        >
          <div className="space-y-8 md:space-y-12">
            {/* Hero Name */}
            <OptimizedParallax speed={0.3} direction="up">
              <motion.h1 
                id="hero-heading"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary) 50%, var(--color-secondary) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {PERSONAL_INFO.name}
              </motion.h1>
            </OptimizedParallax>
            
            {/* Title Section */}
            <OptimizedParallax speed={0.5} direction="up">
              <div className="flex flex-col items-center space-y-6">
                {/* Decorative Divider */}
                <motion.div 
                  className="w-24 h-1 rounded-full"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
                  }}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 96, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
                
                <motion.p 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide leading-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {PERSONAL_INFO.title}
                </motion.p>
                
                {/* Subtitle */}
                <motion.p 
                  className="text-lg sm:text-xl md:text-2xl max-w-3xl leading-relaxed font-light"
                  style={{ color: 'var(--color-text-secondary)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Passionate about creating innovative web solutions with modern technologies
                </motion.p>
              </div>
            </OptimizedParallax>
            
            {/* CTA Buttons */}
            <OptimizedParallax speed={0.7} direction="up">
              <motion.div
                className="pt-8 md:pt-12 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const aboutSection = document.getElementById('about');
                    aboutSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  rightIcon={<ChevronDown className="w-5 h-5" />}
                >
                  Explore My Work
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Get In Touch
                </Button>
              </motion.div>
            </OptimizedParallax>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

const HeroSection: React.FC = () => {
  return <HeroContent />;
};

export default HeroSection;