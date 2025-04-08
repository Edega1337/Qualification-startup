const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const nodemailer = require('nodemailer');
const { SendMailError } = require("../middleware/error-handler");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
});

const mailService = async (to, link) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Добро пожаловать в команду ${process.env.PROJECT_NAME || 'TrainZone'}!`,
      text: '',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f2f2f2; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #1db954, #1dd1a1); padding: 20px 30px;">
              <h2 style="color: white; margin: 0;">Добро пожаловать в ${process.env.PROJECT_NAME || 'TrainZone'} 🏋️‍♂️</h2>
              <p style="color: #eafaf1; margin: 5px 0 0;">Платформа, где тренеры и спортсмены находят друг друга</p>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Приветствуем тебя на борту! Мы рады, что ты решил стать частью спортивного сообщества 💪</p>
              <p style="font-size: 16px; color: #333;">Остался один шаг — активируй свой аккаунт, чтобы начать размещать объявления и находить клиентов.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #1db954; color: white; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                  Активировать аккаунт
                </a>
              </div>
              <p style="font-size: 14px; color: #888;">Если ты не регистрировался у нас — просто проигнорируй это письмо.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #bbb; text-align: center;">С уважением, команда TrainZone © ${new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      `
    });

    console.log("Сообщение успешно отправлено");
    return {
      message: 'Email sent successfully',
      status: 200
    };
  } catch (err) {
    console.error('Error sending email:', err);
    throw new SendMailError(`Error sending email`, 500);
  }
};





module.exports = { mailService };