const { DAL } = require("./DAL")
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
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
// TODO: Reformat Kafka Topics again
// Topic as Users, Offers, Games
// Key as Created, Updated, Rejected
// Value as the ID
kafkaConsumer.subscribe({ topics: ['Offers', 'Users'], fromBeginning: false });

startListening();

async function startListening() {
    await kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const kafkaKey = message.key.toString();
            const kafkaMessage = message.value.toString();
            // console.log(`Topic: ${topic}`);
            // console.log(`Message: ${kafkaMessage}`);
            const emailInfo = await formatEmails(topic, kafkaKey, kafkaMessage);

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

async function formatEmails(topic, kafkaKey, kafkaMessage) {
    if (topic == "Users"){
        return await formatPasswordEmail(kafkaMessage);
    } else {
        return await formatOfferEmail(topic, kafkaKey, kafkaMessage);
    }
}

async function formatPasswordEmail(kafkaMessage) {
    const user = await DAL.getUserById(kafkaMessage);
    let response = {
        subject: "Password Updated",
        emails: [user.email],
        bodyText: "Your password for the VideoGame Exchange has been updated. If this wasn't you, please contact support at fakeemail@gameexchange.com"
    }
    return response;
}

async function formatOfferEmail(topic, kafkaKey, kafkaMessage) {
    const offer = await DAL.getOfferById(kafkaMessage);
    const requestedOwner = await DAL.getUserById(offer.requestedOwner);
    const offeredOwner = await DAL.getUserById(offer.offeredOwner);

    const requestedGame = await DAL.getGameById(offer.gameRequested);
    const offeredGame = await DAL.getGameById(offer.gameOffered);

    let response = {
        emails: [requestedOwner.email, offeredOwner.email],
    }
    switch (kafkaKey) {
        case "created":
            response.subject = "Offer Created";
            response.bodyText = `A new offer has been created. ${offeredGame.name} has been offered in exchange for ${requestedGame.name}`;
            break;
        case "accepted":
            response.subject = "Offer Accepted";
            response.bodyText = `Your offer has been accepted. The owners for ${offeredGame.name} and ${requestedGame.name} have been swapped.`;
            break;
        case "rejected":
            response.subject = "Offer Rejected";
            response.bodyText = `Your offer has been rejected. The owners for ${offeredGame.name} and ${requestedGame.name} stay the same.`;
            break;
        default:
            response.subject = "Unknown Subject";
            response.bodyText = "This email isn't supposed to be sent... Please contact support at fakeemail@gameexchange.com";
            break;
    }
    return response;
}