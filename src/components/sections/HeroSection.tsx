import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ParallaxContainer from '../effects/ParallaxContainer';
import { getTransitionStyles } from '../../utils/themeUtils';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';
import { PERSONAL_INFO } from '../../data/portfolio';

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
  
  const primaryButtonStyles = {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-primary-foreground)',
    borderColor: 'var(--color-primary)',
    boxShadow: 'var(--shadow-lg)',
    ...getTransitionStyles(['background-color', 'transform', 'box-shadow'])
  };
  
  const secondaryButtonStyles = {
    backgroundColor: 'var(--color-surface-glass)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border)',
    backdropFilter: 'blur(12px)',
    ...getTransitionStyles(['background-color', 'border-color', 'color', 'transform'])
  };
  
  return (
    <section id="hero" className="section-container-first relative overflow-hidden min-h-screen flex items-center justify-center pt-20">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0" style={backgroundStyles}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(45deg, var(--color-primary-alpha) 0%, transparent 30%, var(--color-secondary-alpha) 100%)'
        }}></div>
      </div>
      
      {/* Geometric Background Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Large floating shapes */}
        <div className="absolute top-20 right-20 w-40 h-40 rounded-full blur-2xl animate-pulse" style={{
          backgroundImage: 'linear-gradient(135deg, var(--color-primary-alpha) 0%, var(--color-secondary-alpha) 100%)'
        }} />
        <div className="absolute bottom-32 left-16 w-32 h-32 rounded-full blur-xl animate-pulse" style={{
          backgroundImage: 'linear-gradient(135deg, var(--color-secondary-alpha) 0%, var(--color-primary-alpha) 100%)',
          animationDelay: "1s"
        }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full blur-lg animate-pulse" style={{
          backgroundImage: 'linear-gradient(135deg, var(--color-primary-alpha) 0%, var(--color-secondary-alpha) 100%)',
          animationDelay: "2s"
        }} />
        
        {/* Geometric patterns */}
        <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full animate-ping" style={{
          backgroundColor: 'var(--color-primary-alpha)',
          animationDelay: "0.5s"
        }} />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full animate-ping" style={{
          backgroundColor: 'var(--color-secondary-alpha)',
          animationDelay: "1.5s"
        }} />
        <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 rounded-full animate-ping" style={{
          backgroundColor: 'var(--color-primary-alpha)',
          animationDelay: "2.5s"
        }} />
      </motion.div>
      
      <div className="container mx-auto text-center relative z-10 px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ y, opacity }}
        >
          <div className="space-y-12">
            {/* Name with modern typography */}
            <ParallaxContainer speed={0.3} direction="up">
              <motion.h1 
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 tracking-tight leading-relaxed font-sans whitespace-nowrap py-2"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary) 50%, var(--color-secondary) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  overflow: 'visible'
                }}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              >
                {PERSONAL_INFO.name}
              </motion.h1>
            </ParallaxContainer>
            
            {/* Title with modern styling */}
            <ParallaxContainer speed={0.5} direction="up">
              <div className="flex flex-col items-center space-y-8">
                {/* Decorative line */}
                <motion.div 
                  className="w-24 h-1 rounded-full"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
                  }}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 96, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
                
                <motion.p 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide leading-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                  initial={{ letterSpacing: "0.3em", opacity: 0, y: 20 }}
                  animate={{ letterSpacing: "0.05em", opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  {PERSONAL_INFO.title}
                </motion.p>
                
                {/* Subtitle */}
                <motion.p 
                  className="text-lg sm:text-xl max-w-2xl leading-relaxed font-light"
                  style={{ color: 'var(--color-text-secondary)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                >
                  Passionate about creating innovative web solutions with modern technologies
                </motion.p>
              </div>
            </ParallaxContainer>
            
            {/* CTA Section */}
            <ParallaxContainer speed={0.7} direction="up">
              <motion.div
                className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              >
                {/* Primary CTA */}
                <motion.button
                  className="group relative px-10 py-4 font-semibold rounded-2xl overflow-hidden border-2"
                  style={primaryButtonStyles}
                  {...getThemeAwareMotionProps({
                    whileHover: { scale: 1.05, y: -3 },
                    whileTap: { scale: 0.98 },
                    transition: { duration: 0.15, ease: 'easeOut' }
                  })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, primaryButtonStyles);
                  }}
                  onClick={() => {
                    const aboutSection = document.getElementById('about');
                    aboutSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <span className="text-lg">Explore My Work</span>
                    <motion.svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ y: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </motion.svg>
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                    backgroundImage: 'linear-gradient(90deg, var(--color-primary-hover) 0%, var(--color-secondary) 100%)'
                  }} />
                </motion.button>
                
                {/* Secondary CTA */}
                <motion.button
                  className="group px-8 py-4 border-2 font-semibold rounded-2xl"
                  style={secondaryButtonStyles}
                  {...getThemeAwareMotionProps({
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    transition: { duration: 0.15, ease: 'easeOut' }
                  })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, secondaryButtonStyles);
                  }}
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="flex items-center space-x-2">
                    <span>Get In Touch</span>
                    <motion.svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </span>
                </motion.button>
              </motion.div>
            </ParallaxContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const HeroSection: React.FC = () => {
  return <HeroContent />;
};

export default HeroSection;