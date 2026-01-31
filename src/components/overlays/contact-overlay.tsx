import { profile } from '@/data/portfolio-data'

export function ContactOverlay() {
  return (
    <div className="bg-gray-900/90 border border-fuchsia-500/30 rounded-lg p-6 max-w-md">
      <h2 className="text-2xl font-bold text-fuchsia-400 mb-4">Get in Touch</h2>

      <div className="space-y-4">
        {/* Email */}
        <a
          href={`mailto:${profile.email}`}
          className="block p-3 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 rounded-lg transition"
        >
          <div className="text-fuchsia-300 text-sm">Email</div>
          <div className="text-white">{profile.email}</div>
        </a>

        {/* Social links */}
        <div className="flex gap-4">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center text-white transition"
          >
            GitHub
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center text-white transition"
          >
            LinkedIn
          </a>
        </div>

        {/* Location */}
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <div className="text-gray-400 text-sm">Location</div>
          <div className="text-white">{profile.location}</div>
        </div>
      </div>
    </div>
  )
}
