import { useState } from 'react'
import { FiMail, FiPhone, FiGithub, FiLinkedin } from 'react-icons/fi'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

function Contact({ contactLinks }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Unable to send message.')

      setStatus({ type: 'success', message: 'Message sent successfully.' })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Something went wrong.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Contact"
          title="Let’s connect"
          description="This contact form is connected to the Node/Express backend and stores submissions in the backend data folder."
        />

        <div className="contact-grid">
          <Reveal className="card contact-card">
            <h3>Contact Details</h3>
            <a href={`mailto:${contactLinks.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiMail size={18} /> {contactLinks.email}
            </a>
            {contactLinks.phone && (
              <a href={`tel:${contactLinks.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiPhone size={18} /> {contactLinks.phone}
              </a>
            )}
            <a href={contactLinks.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiLinkedin size={18} /> LinkedIn
            </a>
            <a href={contactLinks.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiGithub size={18} /> GitHub
            </a>
          </Reveal>

          <Reveal className="card contact-form-card" delay={120}>
            <form onSubmit={handleSubmit} className="contact-form">
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
              <textarea name="message" rows="6" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
              <button type="submit" className="button primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {status.message ? (
                <p className={status.type === 'success' ? 'success-text' : 'error-text'}>{status.message}</p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Contact
