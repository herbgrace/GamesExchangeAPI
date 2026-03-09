const { DAL } = require("./DAL")
const express = require("express");
const app = express();
const {collectDefaultMetrics, register} = require('prom-client');
const METRICS_PORT = 7001;
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
kafkaConsumer.subscribe({ topics: ['Offers', 'Users'], fromBeginning: false });

collectDefaultMetrics();
startListening();

// This endpoint method was made using the help of Prometheus' documentation:
// https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-nodejs/
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
});

app.listen(`${METRICS_PORT}`, (req, res) => {
    // console.log(`Email Service is listening on port ${METRICS_PORT}`);
});

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
        return await formatOfferEmail(kafkaKey, kafkaMessage);
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

async function formatOfferEmail(kafkaKey, kafkaMessage) {
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