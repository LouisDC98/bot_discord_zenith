export function interactButtons(client) {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) {
            return
        }
        if (interaction.customId === "progQuot") {
            await toggleRole(interaction, "1225431919647264900");
        }
        if (interaction.customId === "progHebdo") {
            await toggleRole(interaction, "1225437631605899305");
        }
    })
}

async function toggleRole(interaction, roleId) {
    try {
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId);
            console.log("Le rôle a été retiré avec succès");
        } else {
            await member.roles.add(roleId);
            console.log("Le rôle a été ajouté avec succès");
        }

        sendEphemeralMessage(interaction, "L'opération a été effectuée avec succès!", 7000);
    } catch (error) {
        console.error("Erreur lors de l'exécution de l'opération:", error);
        sendEphemeralMessage(interaction, "Une erreur s'est produite lors de l'opération.", 7000);
    }
}

async function sendEphemeralMessage(interaction, content, duration) {
    const reply = await interaction.reply({ content, ephemeral: true });
    setTimeout(async () => {
        await reply.delete();
    }, duration);
}
