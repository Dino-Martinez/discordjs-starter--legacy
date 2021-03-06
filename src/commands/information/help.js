const { EmbedWrapper } = require('../../utils/EmbedWrapper.js')

module.exports = {
  name: 'help',
  aliases: ['commands'],
  description: 'Sends information on available commands.',
  usage: '[command | optional]',
  minArgs: 0,
  cooldown: 2,
  dmCommand: true,
  guildCommand: true,
  execute (props) {
    // Destructure the things we need out of props
    const { message, args, client, prefix } = props
    const { guild, channel } = message

    // Check that the command is in a dm or the guild is available for processing
    if (!guild || guild.available) {
      // Build response string based on number of args
      const response = new EmbedWrapper(
        args.length < 1
          ? 'Here is a list of my commands:'
          : 'Here is information on the commands you requested:'
      )

      if (args.length > 0) {
        // We have args, which means a specific list of commands was requested
        args.forEach(requestedCommand => {
          const command = client.commands.get(requestedCommand)
          if (command) {
            response.addField(
              `\n- ${command.name}:`,
              `Description: ${command.description}\n  Usage: \`${prefix}${command.name} ${command.usage}\`\n`
            )
          }
        })
      } else {
        // We have no args, which means no specific commands were requested
        // Return list of all commands
        client.commands.forEach(command => {
          if ((command.dmCommand && !guild) || (command.guildCommand && guild)) {
            response.addField(`- ${command.name}:`, ` ${command.description}`)
          }
        })
      }

      // Send formatted response to user
      channel.send(response)
    } else {
      throw new Error('The guild is not available')
    }
  }
}
