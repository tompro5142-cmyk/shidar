const { cmd } = require('../command');
const { anony } = require('../lib/terri');


cmd({
    pattern: "hack",
    desc: "Simulates a realistic hacking sequence for demonstration",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { 
    from, senderNumber, reply 
}) => {
    try {
        // Get the bot owner's number dynamically
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("Access denied. Owner only.");
        }

        const steps = [
            '🔍 *Scanning network...*',
            '🛠️  Loading exploit modules',
            '🌐 Establishing SSH connection...',
            '```[████----] 25%```',
            '✅ Bypassing firewall',
            '🔓 Cracking credentials...',
            '```[████████----] 50%```',
            '📁 Accessing file system',
            '⚡ Injecting payload',
            '```[████████████----] 75%```',
            '🔄 Covering tracks',
            '✅ Operation completed',
            '```[████████████████] 100%```',
            '*System compromised* 🔓',
            '> Demo purposes only - Ethical hacking recommended'
        ];

        for (const line of steps) {
            await conn.sendMessage(from, { text: line }, { quoted: anony });
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});