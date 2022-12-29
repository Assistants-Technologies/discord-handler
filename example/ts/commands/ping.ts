export default {
    name: 'ping',
    execute: (client, message, args) => {
        message.channel.send('Pong!');
    }
}