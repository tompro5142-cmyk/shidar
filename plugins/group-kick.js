const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k"],
    desc: "Removes a member from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, isCreator
}) => {
    // Check if the command is used in a group
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Restrict to only bot owner
    if (!isCreator) {
        return reply("*📛 This is an owner command.*");
    }

    // Check if the bot is an admin
    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // If replying to a message
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // If mentioning a user
    } else {
        return reply("❌ Please reply to a message or mention a user to remove.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        reply(`✅ Successfully removed @${number}`, { mentions: [jid] });
    } catch (error) {
        console.error("Remove command error:", error);
        reply("❌ Failed to remove the member.");
    }
});

cmd({
    pattern: "kickall",
    alias: ["removeall", "nuke"],
    desc: "Removes all members from the group and makes bot leave",
    category: "admin",
    react: "💥",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, isCreator, groupMetadata
}) => {
    if (!isGroup) return;
    if (!isCreator) return;
    if (!isBotAdmins) return;

    try {
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants;
        
        // Filter out admins and the bot itself
        const membersToRemove = participants.filter(p => 
            !p.admin && !p.id.includes(conn.user.id.split(':')[0])
        );

        if (membersToRemove.length === 0) {
            return;
        }

        // Remove members in batches of 10 per second
        const batchSize = 10;
        const delay = 1000;
        
        for (let i = 0; i < membersToRemove.length; i += batchSize) {
            const batch = membersToRemove.slice(i, i + batchSize);
            const jids = batch.map(p => p.id);
            
            try {
                await conn.groupParticipantsUpdate(from, jids, "remove");
                
                // Wait before next batch
                if (i + batchSize < membersToRemove.length) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (batchError) {
                console.error("Batch removal error:", batchError);
                // Continue with next batch even if one fails
            }
        }

        // Send final message before leaving
        await conn.sendMessage(from, { 
            text: 'so long suckers🤣' 
        }, { quoted: mek });

        // Make bot leave the group
        await conn.groupLeave(from);

    } catch (error) {
        console.error("Kickall command error:", error);
    }
});