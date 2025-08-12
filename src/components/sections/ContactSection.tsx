import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ParallaxContainer from '../effects/ParallaxContainer';
import { toast } from 'sonner';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const personalInfo = {
  email: 'truonghuan0709@gmail.com',
  phone: '+84 335 597 676',
  location: 'Ho Chi Minh City, Vietnam',
  linkedin: 'https://linkedin.com/in/truongquochuan',
  github: 'https://github.com/truongquochuan'
};

const getContactInfo = () => [
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email',
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    colorStyles: {
      bg: 'var(--color-primary)',
      text: 'var(--color-primary)',
      bgLight: 'var(--color-primary-muted)'
    }
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Phone',
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
    colorStyles: {
      bg: 'var(--color-success)',
      text: 'var(--color-success)',
      bgLight: 'var(--color-success-muted)'
    }
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Location',
    value: personalInfo.location,
    colorStyles: {
      bg: 'var(--color-accent)',
      text: 'var(--color-accent)',
      bgLight: 'var(--color-accent-muted)'
    }
  },
];

const getSocialLinks = () => [
  {
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    href: personalInfo.linkedin,
    hoverStyles: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-primary-foreground)'
    }
  },
  {
    name: 'GitHub',
    icon: <Github className="w-5 h-5" />,
    href: personalInfo.github,
    hoverStyles: {
      backgroundColor: 'var(--color-text-primary)',
      color: 'var(--color-background)'
    }
  },
];

const ContactSection: React.FC = () => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
  
  const { ref: sectionRef, inView: sectionInView } = useScrollAnimation();
  
  // Section variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
  };
  const { ref: titleRef, inView: titleInView } = useScrollAnimation();
  const { ref: infoRef, inView: infoInView } = useScrollAnimation();
  const { ref: formRef, inView: formInView } = useScrollAnimation();
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };
  
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0.9]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success notification
      toast.success('Message sent successfully!', {
        description: 'Thank you for reaching out. I\'ll get back to you soon.',
        icon: <CheckCircle className="w-4 h-4" />,
      });
      
      reset();
    } catch (error) {
      // Error notification
      toast.error('Failed to send message', {
        description: 'Please try again or contact me directly via email.',
        icon: <AlertCircle className="w-4 h-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-container relative overflow-hidden" style={{
      ...backgroundStyles,
      color: 'var(--color-text-primary)'
    }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(var(--color-text-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '3.5s' }} />
      </div>
      
      <div className="container mx-auto relative z-10">
        <ParallaxContainer speed={0.4} direction="up">
          <motion.div
            ref={titleRef}
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
          >
            <h2 id="contact-heading" className="text-4xl md:text-5xl font-bold mb-6" style={{
              background: 'linear-gradient(to right, var(--color-primary), var(--color-accent), var(--color-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Get In Touch</h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Ready to start your next project? Let's discuss how we can work together to bring your ideas to life.
            </p>
          </motion.div>
        </ParallaxContainer>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 relative z-10">
          {/* Contact Information */}
          <ParallaxContainer speed={0.3} direction="left">
            <motion.div
              ref={infoRef}
              className="relative z-20"
              variants={cardVariants}
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
            >
            <h3 className="text-2xl font-semibold mb-8" style={{ color: 'var(--color-text-primary)' }}>Contact Information</h3>
            
            <div className="space-y-4 sm:space-y-6">
              {getContactInfo().map((info, index) => (
                <motion.div
                  key={info.title}
                  className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 group cursor-pointer rounded-xl backdrop-blur-sm border"
                  style={{
                    backgroundColor: 'var(--color-surface-glass)',
                    borderColor: 'var(--color-border-glass)'
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }
                  }}
                  initial="hidden"
                  animate={infoInView ? "visible" : "hidden"}
                  {...getThemeAwareMotionProps({
                    whileHover: { scale: 1.02, rotateY: 5 },
                    transition: { duration: 0.15, ease: 'easeOut' }
                  })}
                  onClick={() => info.href && window.open(info.href, '_blank')}
                >
                  <div 
                    className="p-2 sm:p-3 rounded-xl transition-all duration-300 shadow-lg flex-shrink-0"
                    style={{
                      background: `linear-gradient(to bottom right, ${info.colorStyles.bgLight}, ${info.colorStyles.bgLight}90)`,
                      color: info.colorStyles.text
                    }}
                  >
                    {info.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm sm:text-base transition-colors" style={{ color: 'var(--color-text-primary)' }}>{info.title}</h4>
                    <p className="text-xs sm:text-sm break-words" style={{ color: 'var(--color-text-secondary)' }}>{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Social Links */}
            <motion.div
              className="mt-8"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.3 }
                }
              }}
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
            >
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: 'var(--color-text-primary)' }}>Connect With Me</h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {getSocialLinks().map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-3 backdrop-blur-sm rounded-xl transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl border"
                    style={{
                      backgroundColor: 'var(--color-surface-glass)',
                      borderColor: 'var(--color-border-glass)',
                      color: 'var(--color-text-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, social.hoverStyles);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-glass)';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                    variants={{
                      hidden: { opacity: 0, scale: 0, rotateY: -90 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        rotateY: 0,
                        transition: { 
                          delay: index * 0.1 + 0.4,
                          type: "spring",
                          stiffness: 200
                        }
                      }
                    }}
                    initial="hidden"
                    animate={infoInView ? "visible" : "hidden"}
                    {...getThemeAwareMotionProps({
                      whileHover: { scale: 1.1, rotateY: 10 },
                      whileTap: { scale: 0.9 },
                      transition: { duration: 0.1, ease: 'easeOut' }
                    })}
                  >
                    {social.icon}
                    <span className="text-xs sm:text-sm font-medium">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            </motion.div>
          </ParallaxContainer>
          
          {/* Contact Form */}
          <ParallaxContainer speed={0.2} direction="right">
            <motion.div
              ref={formRef}
              className="relative z-20"
              variants={formVariants}
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
            >
            <form onSubmit={handleSubmit(onSubmit)} className="backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border lg:mr-4" style={{
              backgroundColor: 'var(--color-surface-glass)',
              borderColor: 'var(--color-border-glass)'
            }}>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6" style={{ color: 'var(--color-text-primary)' }}>Send Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  {...register('name', { required: 'Name is required' })}
                  label="Name"
                  placeholder="Your full name"
                  error={errors.name?.message}
                  fullWidth
                />
                
                <Input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  label="Email"
                  placeholder="your.email@example.com"
                  error={errors.email?.message}
                  leftIcon={<Mail className="w-4 h-4" />}
                  fullWidth
                />
              </div>
              
              <div className="mb-4">
                <Input
                  {...register('subject', { required: 'Subject is required' })}
                  label="Subject"
                  placeholder="What's this about?"
                  error={errors.subject?.message}
                  fullWidth
                />
              </div>
              
              <div className="mb-6">
                <Textarea
                  {...register('message', { required: 'Message is required' })}
                  label="Message"
                  placeholder="Tell me about your project..."
                  error={errors.message?.message}
                  rows={5}
                  resize="none"
                  showCharCount
                  maxLength={1000}
                  fullWidth
                />
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
            </motion.div>
          </ParallaxContainer>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;