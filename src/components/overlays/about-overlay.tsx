import { motion } from 'framer-motion'
import { profile } from '@/data/portfolio-data'

export function AboutOverlay() {
  return (
    <motion.div
      className="bg-[rgba(30,22,15,0.92)] backdrop-blur-2xl border border-[rgba(255,170,68,0.15)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-[0_0_40px_rgba(255,170,68,0.08)]"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Avatar */}
      <div className="flex justify-center mb-5">
        <motion.div
          className="w-28 h-28 aspect-square rounded-full overflow-hidden border-2 border-amber-400/50 shadow-[0_0_25px_rgba(255,170,68,0.25)]"
          animate={{ boxShadow: ['0 0 20px rgba(255,170,68,0.2)', '0 0 30px rgba(255,170,68,0.35)', '0 0 20px rgba(255,170,68,0.2)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Name & Title */}
      <h2 className="text-2xl font-bold text-white text-center">{profile.name}</h2>
      <p className="text-amber-400 text-center mb-4">{profile.title}</p>

      {/* Bio */}
      <p className="text-[#d4c4b0] text-sm leading-relaxed mb-5">
        {profile.description}
      </p>

      {/* Location badge */}
      <div className="flex items-center justify-center gap-2 text-[#a89080] text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{profile.location}</span>
      </div>
    </motion.div>
  )
}
