import React from 'react';
import { motion } from 'framer-motion';
import { skills, skillCategories } from '../../data/skills';
import { getSkillsByCategory, getSkillLevelColor, getSkillLevelText } from '../../utils/skillUtils';
import { getThemeAwareMotionProps } from '../../utils/motionConfig';

const SkillsSection: React.FC = () => {
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
    <section id="skills" className="py-20 md:py-32 relative overflow-hidden" style={backgroundStyles}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        
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
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border shadow-lg mb-6"
            style={{
              backgroundColor: 'var(--color-surface-glass)',
              borderColor: 'var(--color-border-glass)',
              color: 'var(--color-text-primary)'
            }}
          >
            <span className="text-2xl">⚡</span>
            <span className="font-semibold">Technical Expertise</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Skills & Technologies
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Mastering cutting-edge technologies to build exceptional digital experiences
          </motion.p>
        </motion.div>
        
        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {skillCategories
            .sort((a, b) => {
              const order = ['Frontend Development', 'Backend Development', 'Tools & Technologies', 'Database'];
              return order.indexOf(a.name) - order.indexOf(b.name);
            })
            .map((category, categoryIndex) => {
            const categorySkills = getSkillsByCategory(category.name);
            

            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: categoryIndex * 0.15
                }}
                viewport={{ once: true }}
                className="group cursor-pointer hover:z-10"
              >
                <div className="h-full p-6 md:p-8 rounded-3xl backdrop-blur-xl border shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden flex flex-col min-h-[420px] group-hover:border-opacity-60" style={{
                  backgroundColor: 'var(--color-surface-glass)',
                  borderColor: 'var(--color-border-glass)'
                }}>
                  {/* Hover Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  {/* Category Header */}
                  <div className="relative z-10 flex items-center mb-6 flex-shrink-0">
                    <motion.div 
                      className={`p-4 bg-gradient-to-br ${
                        category.color === 'accent-blue' ? 'from-blue-500 via-blue-600 to-indigo-700' : 
                        category.color === 'accent-green' ? 'from-emerald-500 via-teal-600 to-cyan-700' :
                        category.color === 'accent-purple' ? 'from-purple-500 via-violet-600 to-indigo-700' :
                        'from-cyan-500 via-blue-600 to-purple-700'
                      } text-white rounded-2xl mr-4 shadow-lg ring-2 ring-white/20`}
                      {...getThemeAwareMotionProps({
                        whileHover: { rotate: 5, scale: 1.1, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
                        transition: { duration: 0.15, ease: 'easeOut' }
                      })}
                    >
                      <span className="text-2xl drop-shadow-sm">{category.icon}</span>
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                        {category.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {categorySkills.length} skills
                      </p>
                    </div>
                  </div>
                  
                  {/* Skills List */}
                  <div className="relative z-10 flex flex-col gap-3 flex-grow">
                    {categorySkills.map((skill, skillIndex) => {
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: categoryIndex * 0.1 + skillIndex * 0.05
                          }}
                          viewport={{ once: true }}
                          className="group/skill flex-shrink-0 relative"
                        >
                          <div className="flex items-center justify-between p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-md group-hover/skill:scale-[1.02]" style={{
                            backgroundColor: 'var(--color-surface-muted)',
                            borderColor: 'var(--color-border-muted)'
                          }}>
                            <div className="flex items-center gap-3">
                              {skill.icon && (
                                <motion.div 
                                  className="text-xl flex-shrink-0 p-2 rounded-lg transition-all duration-300"
                                  style={{
                                    backgroundColor: 'var(--color-surface-glass)',
                                    color: 'var(--color-primary)'
                                  }}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                  {skill.icon}
                                </motion.div>
                              )}
                              <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                {skill.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              {/* Progress Bar */}
                              <div className="flex-1 min-w-[80px]">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                                  <motion.div
                                    className={`h-full bg-gradient-to-r ${
                                      skill.level >= 85 ? 'from-emerald-500 to-teal-600' :
                                      skill.level >= 75 ? 'from-blue-500 to-indigo-600' :
                                      skill.level >= 65 ? 'from-amber-500 to-orange-600' :
                                      'from-slate-500 to-gray-600'
                                    } rounded-full relative ${
                                      skill.level >= 85 ? 'shadow-lg shadow-emerald-500/30' : ''
                                    }`}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level}%` }}
                                    transition={{ 
                                      duration: 1.2, 
                                      delay: categoryIndex * 0.1 + skillIndex * 0.1,
                                      ease: "easeOut"
                                    }}
                                    viewport={{ once: true }}
                                  >
                                    {skill.level >= 85 && (
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                    )}
                                  </motion.div>
                                </div>
                              </div>
                              {/* Percentage Badge */}
                              <div className="text-right">
                                <motion.div 
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${
                                    skill.level >= 85 ? 'from-emerald-500 to-teal-600' :
                                    skill.level >= 75 ? 'from-blue-500 to-indigo-600' :
                                    skill.level >= 65 ? 'from-amber-500 to-orange-600' :
                                    'from-slate-500 to-gray-600'
                                  } text-white shadow-lg relative overflow-hidden ${
                                    skill.level >= 85 ? 'shadow-emerald-500/30 ring-2 ring-emerald-400/20' : ''
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ 
                                      duration: 0.5, 
                                      delay: categoryIndex * 0.1 + skillIndex * 0.1 + 0.8
                                    }}
                                    viewport={{ once: true }}
                                  >
                                    {skill.level}%
                                  </motion.span>
                                  {skill.level >= 85 && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                                  )}
                                </motion.div>
                               </div>
                            </div>
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
                            <div className="text-center">
                              <div className="font-semibold">{skill.name}</div>
                              <div className="text-gray-300">
                                {skill.level >= 90 ? 'Expert Level' :
                                 skill.level >= 85 ? 'Advanced' :
                                 skill.level >= 75 ? 'Proficient' :
                                 skill.level >= 65 ? 'Intermediate' :
                                 'Beginner'} - {skill.level}%
                              </div>
                            </div>
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;