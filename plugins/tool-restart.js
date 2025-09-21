const config = require('../config');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');
const { spawn } = require('child_process');

cmd({
    pattern: "restart",
    alias: ["rebot", "reboot"],
    react: "🕸️",
    desc: "Restart the bot",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q,
    isGroup, sender, senderNumber, botNumber2, botNumber,
    pushname, isMe, isOwner, isCreator, groupMetadata,
    groupName, participants, groupAdmins, isBotAdmins,
    isAdmins, reply
}) => {
    try {
        if (!isCreator) {
            return reply("🚫 *This command is only for the bot owner (creator).*");
        }

        reply("♻️ Restarting the bot...");
        await sleep(1500);
        

        restartBot();
        
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

function restartBot() {
    try {
        // Try nodemon signal first
        if (process.emit('SIGUSR2')) {
            console.log('Restarting via nodemon...');
            return;
        }
    } catch (e) {}
    
    try {
        // Try spawning new process
        console.log('Restarting via process spawn...');
        const child = spawn(process.argv[0], process.argv.slice(1), {
            stdio: 'inherit',
            detached: true
        });
        child.unref();
        process.exit(0);
    } catch (e) {
        // Fallback to simple exit
        console.log('Restarting via process exit...');
        process.exit(0);
    }
}

// Alternative command with restart options
cmd({
    pattern: "restart2",
    alias: ["reboot2"],
    react: "⚡",
    desc: "Restart bot with options",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { args, reply, isCreator }) => {
    if (!isCreator) {
        return reply("🚫 *This command is only for the bot owner (creator).*");
    }

    const method = args.toLowerCase();
    
    switch(method) {
        case 'nodemon':
            reply("🔄 Restarting via nodemon...");
            await sleep(1000);
            process.emit('SIGUSR2');
            break;
            
        case 'spawn':
            reply("🔄 Restarting via process spawn...");
            await sleep(1000);
            const child = spawn(process.argv[0], process.argv.slice(1), {
                stdio: 'inherit',
                detached: true
            });
            child.unref();
            process.exit(0);
            break;
            
        case 'exit':
        default:
            reply("🔄 Restarting bot...");
            await sleep(1000);
            process.exit(0);
            break;
    }
});