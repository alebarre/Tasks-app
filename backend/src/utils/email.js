/**
 * Autor: Alexandre Barreto
 * Data: 2026-05-13
 */
import nodemailer from 'nodemailer';
import { config } from '../config/unifiedConfig.js';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'localhost',
  port: process.env.MAIL_PORT || 1025,
  secure: false, // true for 465, false for other ports
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"TaskApp" <noreply@taskapp.com>',
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Falha ao enviar e-mail. Verifique se o servidor de e-mail (Mailhog) está rodando.');
  }
};
