import cron from 'node-cron'
import { format, getEvent } from './event.js';

export function launchCron(client) {

    cron.schedule('0 12 * * *', async () => {
        let messageText = await dailyEvent()
        const channel = client.channels.cache.find(channel => channel.name === "prog-quotidienne")
        channel.send(messageText)
    });

    cron.schedule('0 12 * * 7', async () => {
        let messageText = await weeklyEvent()
        const channel = client.channels.cache.find(channel => channel.name === "prog-hebdo")
        channel.send(messageText)
    });
}

export async function dailyEvent() {
    let event = await getEvent(true)
    if (event !== null) {
        let sanitizeEvent = format(event, true)
        if (sanitizeEvent.length === 0) {
            return;
        }
        return sanitizeEvent
    }
}

export async function weeklyEvent() {
    let event = await getEvent()
    if (event !== null) {
        let sanitizeEvent = format(event)
        if (sanitizeEvent.length === 0) {
            return;
        }
        return sanitizeEvent
    }
}