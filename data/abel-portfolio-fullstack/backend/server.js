import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const PORT = process.env.PORT || 5001

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const portfolioPath = path.join(__dirname, 'data', 'portfolio.json')
const messagesPath = path.join(__dirname, 'data', 'messages.json')

app.use(cors())
app.use(express.json())

async function readJson(filePath, fallback) {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch {
    return fallback
  }
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8')
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Portfolio backend is running.' })
})

app.get('/api/portfolio', async (_req, res) => {
  const data = await readJson(portfolioPath, {})
  res.json(data)
})

app.get('/api/contact', async (_req, res) => {
  const messages = await readJson(messagesPath, [])
  res.json(messages)
})

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {}

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'All contact form fields are required.',
    })
  }

  const messages = await readJson(messagesPath, [])
  const newMessage = {
    id: Date.now(),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
  }

  messages.unshift(newMessage)
  await writeJson(messagesPath, messages)

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `New message from ${name}: ${subject}`,
    html: `
      <h2>New Portfolio Contact</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  })

  return res.status(201).json({
    success: true,
    message: 'Message received successfully.',
    submission: newMessage,
  })
})

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing server and try again.`)
    process.exit(1)
  } else {
    throw err
  }
})
