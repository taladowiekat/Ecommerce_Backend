import nodemailer from 'nodemailer'

export async function sendEmail(to , subject , html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILSENDER,
            pass: process.env.EMAILPASS
        }
    })

    // send mail with defined transport object
    const info = await transporter.sendMail({

        from: `"Tala Dowiekat 👻" <${process.env.EMAIL}>`,
        to: to,
        subject: subject,
        html
    })

    return info 
}