import { profile, skills } from '@/data/portfolio-data'

// Validate URL to prevent XSS via javascript: protocol
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// Sanitize URL - returns # if invalid
const sanitizeUrl = (url: string): string => {
  return isValidUrl(url) ? url : '#'
}

export function StaticFallback() {
  // Pre-sanitize URLs
  const githubUrl = sanitizeUrl(profile.social.github)
  const linkedinUrl = sanitizeUrl(profile.social.linkedin)
  const emailUrl = `mailto:${encodeURIComponent(profile.email)}`

  return (
    <div className="min-h-screen bg-[#050510] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <header className="text-center py-16">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-cyan-400 object-cover"
          />
          <h1 className="text-4xl font-bold text-cyan-400">{profile.name}</h1>
          <p className="text-xl text-gray-400 mt-2">{profile.title}</p>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">{profile.description}</p>
        </header>

        {/* Skills */}
        <section className="py-8">
          <h2 className="text-2xl font-bold text-center mb-8">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((category) => (
              <div
                key={category.title}
                className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/20"
              >
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => (
                    <span
                      key={skill.name}
                      className="px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <footer className="py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <a href={emailUrl} className="text-cyan-400 hover:underline">
            {profile.email}
          </a>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              GitHub
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
            >
              LinkedIn
            </a>
          </div>
        </footer>

        <p className="text-center text-gray-600 text-sm">
          For the full 3D experience, please use a WebGL-enabled browser.
        </p>
      </div>
    </div>
  )
}
