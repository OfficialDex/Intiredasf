// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
// Functions
const log = new CatLoggr();
const generated = new Set();

module.exports = {
	name: 'gen', // Command name
	description: 'Generate an Roblox alt account', // Command description

    /**
     * Command exetute
     * @param {Message} message The message sent by user
     * @param {Array[]} args Arguments splitted by spaces after the command name
     */
	execute(message, args) {
        // If the generator channel is not given in config or invalid
        try {
            message.client.channels.cache.get(config.genChannel).id; // Try to get the channel's id
        } catch (error) {
            if (error) log.error(error); // If an error occured log to console

            // Send error messsage if the "error_message" field is "true" in the configuration
            if (config.command.error_message === true) {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Error occured!')
                    .setDescription('Not a valid gen channel specified!')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );
            } else return;
        };
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
        // If the message channel id is the generator channel id in configuration
        if (message.channel.id === config.genChannel) {
            // If the user have cooldown on the command
            if (generated.has(message.author.id)) {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Cooldown!')
                    .setDescription(`Please wait you are on  **${config.genCooldownsec} seconds cooldown**`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );
            } else {
                // Parameters
                const service = args[0];
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
                // If the "service" parameter is missing
                if (!service) {
                    return message.channel.send(
                        new MessageEmbed()
                        .setColor(config.color.red)
                        .setTitle('Missing parameters!')
                        .setDescription('You need to give a account year!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setTimestamp()
                    );
                };
                
                // File path to find the given service
                const filePath = `${__dirname}/../stock/${args[0]}.txt`;

                // Read the service file
                fs.readFile(filePath, function (error, data) {
                    // If no error
                    if (!error) {
                        data = data.toString(); // Stringify the content
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
                        const position = data.toString().indexOf('\n'); // Get position
                        const firstLine = data.split('\n')[0]; // Get the first line

                        // If the service file is empty
                        if (position === -1) {
                            return message.channel.send(
                                new MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Generator error!')
                                .setDescription(`Sorry, I can't find the \`${args[0]}\` account in my stock!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );
                        };
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
                        // Send messages to the user
                        const embedMessage = new MessageEmbed()
    .setColor(config.color.green)
    .setTitle('Generated account')
    .addField('Account', `\`\`\`${args[0][0].toUpperCase()}${args[0].slice(1).toLowerCase()}\`\`\``, true)
    .addField('Account', `\`\`\`${firstLine}\`\`\``, true)
    .setTimestamp();

message.author.send(`__Here is your generated account info:__\n\nAccount year: **${args[0][0].toUpperCase()}${args[0].slice(1).toLowerCase()}**\nAccount: *${firstLine}*`);
message.author.send(embedMessage);



                        // Send message to the channel if the user recieved the message
                        if (position !== -1) {
                            data = data.substr(position + 1); // Remove the gernerated account line
                            
                            // Write changes
                            fs.writeFile(filePath, data, function (error) {
                                message.channel.send(
                                    new MessageEmbed()
                                    .setColor(config.color.green)
                                    .setTitle('Account generated seccessfully!')
                                    .setDescription(`Check your Dm${message.author}! **If you having problems then contact to generator support team**`)
                                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                    .setTimestamp()
                                );

                                generated.add(message.author.id); // Add user to the cooldown set

                                // Set cooldown time
                                setTimeout(() => {
                                    generated.delete(message.author.id); // Remove the user from the cooldown set after expire
                                }, config.genCooldown);
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT
                                if (error) return log.error(error); // If an error occured, log to console
                            });
                        } else {
                            // If the service is empty
                            return message.channel.send(
                                new MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Generator error!')
                                .setDescription(`The \`${args[0]}\` account is empty!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );
                        };
                    } else {
                        // If the service does not exists
                        return message.channel.send(
                            new MessageEmbed()
                            .setColor(config.color.red)
                            .setTitle('Generator error!')
                            .setDescription(`Account \`${args[0]}\` does not exist!`)
                            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                            .setTimestamp()
                        );
                    };
                });
            };
        } else {
            // If the command executed in another channel
            message.channel.send(
                new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Wrong command usage!')
                .setDescription(`You cannot use the \`gen\` command in this channel! Try it in <#${config.genChannel}>!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	}
};
//Made By ScienceGear#4409 Youtube https://www.youtube.com/c/ScienceGearYT