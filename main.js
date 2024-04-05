import { launchBot } from './bot.js';
import { launchCron } from './cron.js';
import * as dotenv from 'dotenv'

dotenv.config()

function main() {
    const client = launchBot()
    launchCron(client)
}

main()