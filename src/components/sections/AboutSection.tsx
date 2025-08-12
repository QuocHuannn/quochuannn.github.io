import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { personalInfo } from '../../data/personal';
import { skills } from '../../data/skills';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { generateSrcSet, generateSizes, getOptimalFormat } from '../../utils/imageOptimization';
import { useThemeClassName } from '../../hooks/useThemeSelectors';
import { getThemeStyles, getTransitionStyles } from '../../utils/themeUtils';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
};
import { Download, MapPin, Calendar, Code, Coffee, Music } from 'lucide-react';
import ParallaxContainer from '../effects/ParallaxContainer';
import LazyImage from '../ui/LazyImage';

const AboutSection: React.FC = () => {
  const { ref: sectionRef, inView: sectionInView } = useScrollAnimation();
  const { ref: titleRef, inView: titleInView } = useScrollAnimation({ threshold: 0.3 });
  const { ref: contentRef, inView: contentInView } = useScrollAnimation({ threshold: 0.2 });
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const themeClassName = useThemeClassName();

  const sectionStyles = getThemeStyles('surface', 'default');
  const decorationStyles = getThemeStyles('surface', 'glass');
  const transitionStyles = getTransitionStyles();

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
    <motion.section 
      ref={sectionRef}
      id="about" 
      className={`section-container relative overflow-hidden ${themeClassName}`}
      variants={sectionVariants}
      initial="hidden"
      animate={sectionInView ? "visible" : "hidden"}
    >
      {/* Modern Gradient Background - matching HeroSection */}
      <div className="absolute inset-0" style={backgroundStyles}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(45deg, var(--color-primary-alpha) 0%, transparent 30%, var(--color-secondary-alpha) 100%)'
        }}></div>
      </div>
      
      {/* Geometric Background Elements - matching HeroSection */}
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
      
      <div className="container mx-auto relative z-10">
        <ParallaxContainer speed={0.3} direction="up">
          <motion.div
            ref={titleRef}
            variants={itemVariants}
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <h2 id="about-heading" className="gradient-text mb-6">About Me</h2>
            <p className="max-w-3xl mx-auto" style={{
              color: 'var(--color-text-secondary)'
            }}>
              {personalInfo.bio}
            </p>
          </motion.div>
        </ParallaxContainer>
        
        <motion.div 
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
          variants={sectionVariants}
          initial="hidden"
          animate={contentInView ? "visible" : "hidden"}
        >
          <ParallaxContainer speed={0.2} direction="up">
            <motion.div
              variants={cardVariants}
            >
              <div className="glass-effect p-6 md:p-8">
              <h3 className="text-2xl font-semibold mb-4" style={{
                color: 'var(--color-primary)'
              }}>My Story</h3>
              <p className="leading-relaxed mb-6" style={{
                color: 'var(--color-text-secondary)'
              }}>
                {personalInfo.bio}
              </p>
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3" style={{
                  color: 'var(--color-text-primary)'
                }}>Core Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(skill => skill.level >= 80).slice(0, 8).map((skill) => (
                    <span 
                      key={skill.name}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--color-primary-muted)',
                        color: 'var(--color-primary)'
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Location:</span>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{personalInfo.location}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Experience:</span>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>1+ Year</p>
                </div>
              </div>
              </div>
            </motion.div>
          </ParallaxContainer>
          
          <ParallaxContainer speed={0.4} direction="up">
            <motion.div
              variants={cardVariants}
              className="relative"
            >
              <div className="glass-effect p-6 md:p-8 text-center">
              <div className="relative inline-block mb-6">
                <motion.div
                  variants={itemVariants}
                  {...getThemeAwareMotionProps({
                    whileHover: { scale: 1.05, rotateY: 5 },
                    transition: { duration: 0.15, ease: 'easeOut' }
                  })}
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 shadow-lg smooth-transform mx-auto"
                  style={{
                    borderColor: 'var(--color-surface)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <img
                    src="/images/ava-dlat.JPG"
                    alt={personalInfo.name}
                    className="w-full h-full object-cover"
                    srcSet={generateSrcSet("/images/ava-dlat.JPG", [160, 192, 224, 256], getOptimalFormat())}
                    sizes={generateSizes({
                      '(max-width: 640px)': '160px',
                      '(max-width: 768px)': '192px',
                      '(max-width: 1024px)': '224px'
                    })}
                    loading="lazy"
                    decoding="async"
                    width={256}
                    height={256}
                  />
                </motion.div>
                <motion.div
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                    opacity: 0.2
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{
                color: 'var(--color-text-primary)'
              }}>{personalInfo.name}</h3>
              <p className="text-lg font-medium mb-4" style={{
                color: 'var(--color-primary)'
              }}>{personalInfo.title}</p>
              <div className="flex justify-center space-x-3 sm:space-x-4">
                <motion.a
                  href={`mailto:${personalInfo.email}`}
                  className="p-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-primary-muted)',
                    color: 'var(--color-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary-foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-muted)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  {...getThemeAwareMotionProps({
                    whileHover: { scale: 1.1 },
                    whileTap: { scale: 0.95 },
                    transition: { duration: 0.1, ease: 'easeOut' }
                  })}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </motion.a>
                <motion.a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-primary-muted)',
                    color: 'var(--color-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary-foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-muted)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                <motion.a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-primary-muted)',
                    color: 'var(--color-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-primary-foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-muted)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                  </svg>
                </motion.a>
              </div>
              </div>
            </motion.div>
          </ParallaxContainer>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;