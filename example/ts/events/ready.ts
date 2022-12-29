import Client from "../"

export default {
    name: 'ready',
    once: true,
    execute(client: Client) {
        if (!client.user) return;
        console.log(`Logged in as ${client.user.tag}!`);
        //client.test('test', 'test2'); // We cannot get this working!
    }
}