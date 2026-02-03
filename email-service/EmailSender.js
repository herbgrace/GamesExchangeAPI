const actuallySendEmails = process.env.ACTUALLY_SEND_EMAILS == "true";

const nodemailer = require('nodemailer');
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const sesClient = new SESv2Client({ region: "us-east-1" });

const transporter = actuallySendEmails ? 
nodemailer.createTransport({
    SES: { sesClient, SendEmailCommand }
})
:
nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.ETHEREAL_USERNAME,
        pass: process.env.ETHEREAL_PASSWORD,
    },
});

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'email-service',
    brokers: [`${process.env.KAFKA_HOST || "kafka-broker"}:${process.env.KAFKA_PORT || "9092"}`],
    retry: {

        initialRetryTime: 5000,
        retries: 10
    }
});
const kafkaConsumer = kafka.consumer({ groupId: 'email-notification-consumers' });
kafkaConsumer.connect().then(() => console.log('Email Service Kafka Consumer connected'));
kafkaConsumer.subscribe({ topic: 'email-notifications', fromBeginning: false });

actuallySendEmails ? startListeningReal() : startListening();


async function startListeningReal() { 
    await kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const kafkaMessage = message.value.toString();
            const emailInfo = formatEmail(kafkaMessage);

            (async () => {
                const info = await transporter.sendMail({
                    from: `thelen.alexander05@gmail.com`,
                    to: `${emailInfo.emails.join(', ')}`,
                    subject: `${emailInfo.subject}`,
                    text: `${emailInfo.bodyText}`,
                });

                console.log("Message sent:", info.messageId);
            })();
        }
    });
}

async function startListening() {
    await kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const kafkaMessage = message.value.toString();
            const emailInfo = formatEmail(kafkaMessage);

            (async () => {
                const info = await transporter.sendMail({
                    from: `"${process.env.ETHEREAL_NAME}" <${process.env.ETHEREAL_USERNAME}>`,
                    to: `${emailInfo.emails.join(', ')}`,
                    subject: `${emailInfo.subject}`,
                    text: `${emailInfo.bodyText}`,
                });

                console.log("Message sent:", info.messageId);
            })();
        }
    });
}

function formatEmail(kafkaMessage) {
    let response = {
        subject : kafkaMessage.split('-')[0].trim(),
        emails : [],
        gameRequested : kafkaMessage.match(`GameRequested:([^,]+)`)[1] ??= "none",
        gameOffered : kafkaMessage.match(`GameOffered:([^,]+)`)[1] ??= "none",
    }

    const emails = kafkaMessage.matchAll(`Email:([^,]+)`);
    for (const emailMatch of emails) {
        response.emails.push(emailMatch[1].trim());
    }

    switch (response.subject) {
        case "Password Updated":
            response.bodyText = "Your password for the VideoGame Exchange has been updated. If this wasn't you, please contact support at fakeemail@gameexchange.com";
            break;
        case "Offer Accepted":
            response.bodyText = `Your offer has been accepted. The owners for ${response.gameRequested} and ${response.gameOffered} have been swapped.`;
            break;
        case "Offer Rejected":
            response.bodyText = `Your offer has been rejected. The owners for ${response.gameRequested} and ${response.gameOffered} stay the same.`;
            break;
        case "Offer Created":
            response.bodyText = `A new offer has been created. ${response.gameOffered} has been offered in exchange for ${response.gameRequested}`;
            break;
        default:
            response.bodyText = "You have a notification from the video game exchange system.";
            break;
    }

    return response;
}

// Possible Kafka messages:
// Password Updated- Email:${user.email}
// Offer Accepted- RequestedEmail:${requestedOwner.email}, OffererEmail:${offeredOwner.email}, GameRequested:${gameRequested.title}, GameOffered:${gameOffered.title}
// Offer Rejected- RequestedEmail:${requestedOwner.email}, OffererEmail:${offeredOwner.email}, GameRequested:${gameRequested.name}, GameOffered:${gameOffered.name}
// Offer Created- RequestedEmail:${requestedOwner.email}, OffererEmail:${offeredOwner.email}, GameRequested:${requestedGame.name}, GameOffered:${offeredGame.name}