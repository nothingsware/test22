const Eris = require("eris");
const config = require("./config.json");

const bot = new Eris(config.bot_token);

bot.setup = false;
bot.role_name = config.role_name;
bot.message_id = config.message_id;
bot.channel_id = config.channel_id;

bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.username}`);
});

bot.command("setup", async (msg) => {
    try {
        const message_id = bot.message_id;
        const channel_id = bot.channel_id;

        const channel = bot.getChannel(channel_id);
        if (!channel) return msg.channel.createMessage("Channel Not Found");

        const message = await channel.getMessage(message_id);
        if (!message) return msg.channel.createMessage("Message Not Found");

        await message.addReaction("✅");
        await msg.channel.createMessage("Setup Successful");

        bot.setup = true;
    } catch (error) {
        console.error(error);
        throw error;
    }
});

bot.on("messageReactionAdd", async (payload) => {
    if (!bot.setup) {
        console.log(`Bot is not set up. Type ${config.prefix}setup to set up the bot`);
        return;
    }

    if (payload.message_id === bot.message_id && payload.emoji.name === "✅") {
        const guild = bot.guilds.get(payload.guild_id);
        if (!guild) {
            console.log("Guild Not Found. Terminating Process");
            return;
        }

        const role = guild.roles.find((role) => role.name === bot.role_name);
        if (!role) {
            console.log("Role Not Found. Terminating Process");
            return;
        }

        const member = await guild.getRESTMember(payload.user_id);
        if (!member) return;

        try {
            await member.addRole(role.id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
});

bot.on("messageReactionRemove", async (payload) => {
    if (!bot.setup) {
        console.log(`Bot is not set up. Type ${config.prefix}setup to set up the bot`);
        return;
    }

    if (payload.message_id === bot.message_id && payload.emoji.name === "✅") {
        const guild = bot.guilds.get(payload.guild_id);
        if (!guild) {
            console.log("Guild Not Found. Terminating Process");
            return;
        }

        const role = guild.roles.find((role) => role.name === bot.role_name);
        if (!role) {
            console.log("Role Not Found. Terminating Process");
            return;
        }

        const member = await guild.getRESTMember(payload.user_id);
        if (!member) return;

        try {
            await member.removeRole(role.id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
});

bot.connect();
