import Discord, { GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { interactButtons } from "./subscribeInteractions.js"

export function launchBot() {
  const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ]
  })

  client.on('ready', function () {
    console.log("Je suis connecté !")
    createButtons(client)
    interactButtons(client)
  })

  client.login(process.env.TOKEN)

  return client
}

//send welcome message (only if needed) and add buttons
async function createButtons(client) {
  const channel = client.channels.cache.find(channel => channel.name === "📜fonctionnement")

  const existingMessages = await channel.messages.fetch();
  const welcomeMessage = existingMessages.find(message => message.content.includes("Bienvenue !"));

  if (!welcomeMessage) {
    const row = new ActionRowBuilder()

    row.addComponents(
      new ButtonBuilder()
        .setCustomId("progQuot")
        .setLabel("Suivre la prog quotidienne")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("progHebdo")
        .setLabel("Suivre la prog hebdomadaire")
        .setStyle(ButtonStyle.Success)
    )

    const channelLinkHebdo = `<#${'1225222072498917519'}>`;
    const channelLinkQuot = `<#${'1225143174821969980'}>`;

    const messageObject = {
      content: formatMessage(`
      :robot:  Bienvenue ! :robot:
        Ce bot permet de prévenir les utilisateurs des événements au zénith de Toulouse, deux formules sont disponibles :
        - quotidienne qui envoie une notification tous les jours à 12h si il y a un événement, indiquant le(s) évènement(s) du jour
          - hebdomadaire qui envoie une notification tous les dimanche à 12h si il y a un événement, indiquant le(s) évènement(s) de la semaine

        Pour cela il suffit de s'abonner ou se désabonner en cliquant sur les boutons correspondant. Cela permet d'accéder aux salons :${channelLinkQuot} et ${channelLinkHebdo}.`),
      components: [row]
    };

    channel.send(messageObject)
  }
}

function formatMessage(message) {
  const lines = message.split('\n');
  const firstLineIndentation = lines[0].match(/^\s*/)[0];
  const formattedLines = lines.map(line => line.trim() ? firstLineIndentation + line.trim() : '');
  return formattedLines.join('\n');
}
