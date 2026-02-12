import { motion } from 'framer-motion'
import { profile } from '@/data/portfolio-data'

export function ContactOverlay() {
  return (
    <motion.div
      className="bg-[rgba(30,22,15,0.92)] backdrop-blur-2xl border border-[rgba(255,170,68,0.15)] rounded-2xl p-6 max-w-md w-full mx-4 overflow-hidden shadow-[0_0_40px_rgba(255,170,68,0.08)]"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <h2 className="text-2xl font-bold text-amber-400 mb-4">Get in Touch</h2>

      <div className="space-y-3">
        <a
          href={`mailto:${profile.email}`}
          className="block p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition-colors cursor-pointer"
        >
          <div className="text-amber-300 text-xs mb-0.5">Email</div>
          <div className="text-white text-sm break-all">{profile.email}</div>
        </a>

        <div className="flex gap-3">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-3 bg-[rgba(40,30,20,0.5)] hover:bg-[rgba(50,38,25,0.6)] border border-[rgba(255,170,68,0.12)] rounded-xl text-center text-white text-sm transition-colors cursor-pointer"
          >
            GitHub
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-3 bg-[rgba(40,30,20,0.5)] hover:bg-[rgba(50,38,25,0.6)] border border-[rgba(255,170,68,0.12)] rounded-xl text-center text-white text-sm transition-colors cursor-pointer"
          >
            LinkedIn
          </a>
        </div>

        <div className="p-3 bg-[rgba(40,30,20,0.3)] rounded-xl">
          <div className="text-[#a89080] text-xs mb-0.5">Location</div>
          <div className="text-[#d4c4b0] text-sm">{profile.location}</div>
        </div>
      </div>
    </motion.div>
  )
}
