import { useEffect, useMemo, useState } from 'react'
import portfolioData from './data/portfolio.json'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'

const projectImageMap = {
  neuralcards: new URL('./assets/projects/project-neuralcards.svg', import.meta.url).href,
  epl: new URL('./assets/projects/project-epl-db.svg', import.meta.url).href,
  sports: new URL('./assets/projects/project-sports-site.svg', import.meta.url).href,
  ltf: new URL('./assets/projects/project-ltf.svg', import.meta.url).href,
}

const heroImage = new URL('./assets/abel-profile.svg', import.meta.url).href
const aboutImage = new URL('./assets/about-card.svg', import.meta.url).href

function App() {
  const isDarkMode = true
  const [portfolio] = useState(portfolioData)
  const [activeSection, setActiveSection] = useState('home')

  const sectionIds = useMemo(() => portfolio.navLinks.map((link) => link.id), [portfolio.navLinks])

  useEffect(() => {
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      {
        threshold: 0.35,
        rootMargin: '-15% 0px -45% 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [sectionIds])

  const hero = { ...portfolio.hero, image: portfolio.hero.image || heroImage }
  const about = { ...portfolio.about, image: aboutImage }
  const projects = portfolio.projects.map((project) => ({
    ...project,
    image: projectImageMap[project.imageKey] || projectImageMap.neuralcards,
  }))

  return (
    <div className={isDarkMode ? 'theme-dark' : 'theme-light'}>
      <Navbar
        navLinks={portfolio.navLinks}
        activeSection={activeSection}
        resumeLink={hero.resumeLink}
      />

      <main>
        <Hero data={hero} />
        <About data={about} />
        <Skills skillGroups={portfolio.skills} />
        <Projects projects={projects} />
        <Experience experiences={portfolio.experience} />
        <Education education={portfolio.education} />
        <Achievements achievements={portfolio.achievements} />
        <Contact contactLinks={portfolio.contact} />
      </main>

      <Footer contactLinks={portfolio.contact} />
    </div>
  )
}

export default App
