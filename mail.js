import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    port: 587,
    secure: false,
    service: 'Gmail',
    auth: {
        user: 'testemail261198@gmail.com',
        pass: 'smfbyrqkgqklmoby'
    }
});

export const sendMail = async (userInfo) => {
    const info = await transporter.sendMail({
        from: 'testemail261198@gmail.com',
        to: userInfo?.email,
        subject: "MAI POC",
        html: `<b>Otp:${userInfo?.otp}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
}
