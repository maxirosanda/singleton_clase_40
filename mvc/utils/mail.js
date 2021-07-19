import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'maxirosandacoder@gmail.com',
    pass: 'coderhouse'
  }
})
const mailOptions = (info) => ({
  from: info.from,
  to: info.to || 'maxirosandacoder@gmail.com',
  subject: info.subject,
  html: info.html
})

export const enviarmail = (info) => {
  const options = mailOptions(info)
  transporter.sendMail(options, (err, response) => {
    if (err) {
      throw err
    }

    return response
  })
}
