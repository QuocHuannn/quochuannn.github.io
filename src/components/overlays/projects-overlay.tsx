import { motion } from 'framer-motion'
import { projects } from '@/data/portfolio-data'

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  return (
    <motion.div
      className="group bg-[rgba(40,30,20,0.5)] border border-[rgba(255,170,68,0.1)] rounded-xl p-4 hover:bg-[rgba(50,38,25,0.6)] hover:border-[rgba(255,170,68,0.25)] transition-all duration-200 cursor-default"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <h3 className="text-white font-semibold mb-1 group-hover:text-amber-300 transition-colors">
        {project.title}
      </h3>
      <p className="text-[#a89080] text-xs mb-3 leading-relaxed">{project.description}</p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded-md text-[10px] bg-amber-500/10 text-amber-300/80 border border-amber-500/15"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3 text-xs">
        {project.liveUrl !== '#' && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            Live Demo
          </a>
        )}
        {project.githubUrl !== '#' && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a89080] hover:text-[#d4c4b0] transition-colors cursor-pointer"
          >
            Source
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function ProjectsOverlay() {
  return (
    <div className="bg-[rgba(30,22,15,0.92)] backdrop-blur-2xl border border-[rgba(255,170,68,0.15)] rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-[0_0_40px_rgba(255,170,68,0.08)]">
      <h2 className="text-2xl font-bold text-amber-400 mb-4">Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </div>
  )
}
