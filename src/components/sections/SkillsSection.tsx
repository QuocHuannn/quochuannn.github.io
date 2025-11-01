import React from 'react';
import { motion } from 'framer-motion';
import { skills, skillCategories } from '../../data/skills';
import { getSkillsByCategory } from '../../utils/skillUtils';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';
import Container from '../ui/Container';
import Card from '../ui/Card';

const SkillsSection: React.FC = () => {
  return (
    <section 
      id="skills" 
      className="py-20 md:py-32 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-background)'
      }}
    >
      <Container size="xl" padding="lg" className="relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
            style={{
              backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Skills & Technologies
          </h2>
          
          <p 
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </motion.div>
        
        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {skillCategories
            .sort((a, b) => {
              const order = ['Frontend Development', 'Backend Development', 'Database', 'Tools & Technologies'];
              return order.indexOf(a.name) - order.indexOf(b.name);
            })
            .map((category, categoryIndex) => {
            const categorySkills = getSkillsByCategory(category.name);
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: categoryIndex * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
              >
                <Card variant="glass" padding="lg" hoverable className="h-full">
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
                    <div 
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{
                        backgroundColor: category.color === 'accent-blue' ? 'var(--color-accent-primary)' :
                                         category.color === 'accent-green' ? 'var(--color-success)' :
                                         category.color === 'accent-purple' ? 'var(--color-accent-secondary)' :
                                         'var(--color-warning)',
                        color: 'var(--color-text-inverse)'
                      }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-bold mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {category.name}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Skills List */}
                  <div className="space-y-3">
                    {categorySkills.map((skill, skillIndex) => {
                      const getLevelColor = () => {
                        if (skill.level >= 85) return 'from-[var(--color-success)] to-[var(--color-accent-tertiary)]';
                        if (skill.level >= 75) return 'from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]';
                        if (skill.level >= 65) return 'from-[var(--color-warning)] to-[var(--color-error)]';
                        return 'from-[var(--color-text-tertiary)] to-[var(--color-text-secondary)]';
                      };

                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.4,
                            delay: categoryIndex * 0.05 + skillIndex * 0.03
                          }}
                          viewport={{ once: true }}
                          className="group"
                        >
                          <div 
                            className="flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group-hover:scale-[1.01]"
                            style={{
                              backgroundColor: 'var(--color-surface-secondary)',
                            }}
                          >
                            {/* Skill Icon */}
                            {skill.icon && (
                              <div 
                                className="flex-shrink-0 text-2xl p-2 rounded-lg"
                                style={{
                                  backgroundColor: 'var(--color-surface-glass)',
                                  color: 'var(--color-accent-primary)'
                                }}
                              >
                                {skill.icon}
                              </div>
                            )}
                            
                            {/* Skill Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <span 
                                  className="font-semibold text-sm truncate"
                                  style={{ color: 'var(--color-text-primary)' }}
                                >
                                  {skill.name}
                                </span>
                                <span 
                                  className="text-xs font-bold px-2 py-0.5 rounded"
                                  style={{
                                    backgroundColor: skill.level >= 85 ? 'var(--color-success)' :
                                                   skill.level >= 75 ? 'var(--color-accent-primary)' :
                                                   skill.level >= 65 ? 'var(--color-warning)' :
                                                   'var(--color-text-tertiary)',
                                    color: 'var(--color-text-inverse)'
                                  }}
                                >
                                  {skill.level}%
                                </span>
                              </div>
                              
                              {/* Progress Bar */}
                              <div 
                                className="h-1.5 rounded-full overflow-hidden"
                                style={{ backgroundColor: 'var(--color-surface-tertiary)' }}
                              >
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${getLevelColor()} rounded-full`}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.level}%` }}
                                  transition={{ 
                                    duration: 1,
                                    delay: categoryIndex * 0.05 + skillIndex * 0.03 + 0.2,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                  }}
                                  viewport={{ once: true }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default SkillsSection;