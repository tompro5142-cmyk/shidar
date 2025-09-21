// Credits Terri🧚‍♀️

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (jid) => ({
    mentionedJid: [jid],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363397100406773@newsletter',
        newsletterName: 'Vᴇʀᴏɴɪᴄᴀ Aɪ🧚‍♀️',
        serverMessageId: 143,
    },
});
const getVerifiedContact = () => ({
    key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "VERONICA AI",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN: Tᴇʀʀɪ 🧚‍♀️\nORG:Vᴇʀᴏɴɪᴄᴀ BOT;\nTEL;type=CELL;type=VOICE;waid=93775551335:+256784670936\nEND:VCARD"
        }
    }
});

const defaultProfilePictures = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const getProfilePicture = async (conn, jid) => {
    try {
        return await conn.profilePictureUrl(jid, 'image');
    } catch (error) {
        console.error(`Failed to get profile picture for ${jid}:`, error);
        return defaultProfilePictures[Math.floor(Math.random() * defaultProfilePictures.length)];
    }
};

// 10 Welcome variations
const welcomeMessages = [
    (userName, groupName, groupMembersCount, desc) => `Hey @${userName} 👋\n> Welcome to *${groupName}*.\n> You are member number ${groupMembersCount}!\n> Please read the group description:\n${desc}\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ Tᴇʀʀɪ*`,
    (userName, groupName, groupMembersCount, desc) => `🌟 @${userName}, you have entered *${groupName}*! Enjoy your stay with our ${groupMembersCount} amazing members.\n${desc}\n- Brought to you by Tᴇʀʀɪ 🧚‍♀️`,
    (userName, groupName, groupMembersCount, desc) => `✨ Welcome @${userName} to *${groupName}*.\nYou're the ${groupMembersCount}th star to join us!\n> Group Info:\n${desc}\n- via Tᴇʀʀɪ`,
    (userName, groupName, groupMembersCount, desc) => `Cheers, @${userName}! 🎉\nYou've joined *${groupName}* as member number ${groupMembersCount}.\n> Description:\n${desc}\n- Tᴇʀʀɪ 🧚‍♀️`,
    (userName, groupName, groupMembersCount, desc) => `Hey there, @${userName}!\n> A warm welcome to *${groupName}* (now ${groupMembersCount} strong).\n> Don't forget to check the group rules:\n${desc}\n- Tᴇʀʀɪ`,
    (userName, groupName, groupMembersCount, desc) => `👋 @${userName}, you’ve just landed in *${groupName}*!\n> You're member #${groupMembersCount}.\nRead this to get started:\n${desc}\n- ᴘᴏᴡᴇʀᴇᴅ ʙʏ Tᴇʀʀɪ`,
    (userName, groupName, groupMembersCount, desc) => `Welcome aboard, @${userName}!\n> *${groupName}* now has ${groupMembersCount} members.\n> Please review:\n${desc}\n- Tᴇʀʀɪ 🧚‍♀️`,
    (userName, groupName, groupMembersCount, desc) => `Hi @${userName}, welcome to *${groupName}*!\n> You're the ${groupMembersCount}th friend to join us. Check this out:\n${desc}\n- Tᴇʀʀɪ`,
    (userName, groupName, groupMembersCount, desc) => `@${userName} 👋\nWelcome to the legendary *${groupName}*!\n> You're #${groupMembersCount} in this family.\n${desc}\n- With love, Tᴇʀʀɪ`,
    (userName, groupName, groupMembersCount, desc) => `Salutations, @${userName}!\nWelcome to *${groupName}*.\n> Member count: ${groupMembersCount}\nRemember:\n${desc}\n- Tᴇʀʀɪ 🧚‍♀️`
];

// 10 Goodbye variations
const goodbyeMessages = [
    (userName, groupMembersCount, timestamp) => `> Goodbye @${userName}. 😔\n> Another member has left us.\n> Time: *${timestamp}*\n> We are now ${groupMembersCount} in this group. 😭`,
    (userName, groupMembersCount, timestamp) => `@${userName} has left the building! 🚪\n> Departure time: ${timestamp}\n> ${groupMembersCount} members remain.`,
    (userName, groupMembersCount, timestamp) => `So long, @${userName}!\n> You’ll be missed.\n> Now: ${groupMembersCount} members.\n> Left at: ${timestamp}`,
    (userName, groupMembersCount, timestamp) => `@${userName} waved goodbye 👋\n> We’re now ${groupMembersCount} strong.\n> Left on: ${timestamp}`,
    (userName, groupMembersCount, timestamp) => `> Farewell @${userName}!\n> Safe travels.\n> Group size: ${groupMembersCount}\n> Time: ${timestamp}`,
    (userName, groupMembersCount, timestamp) => `@${userName} exited.\n> Another chapter ends, ${groupMembersCount} left.\n> At: ${timestamp}`,
    (userName, groupMembersCount, timestamp) => `@${userName} is no longer with us.\n> ${groupMembersCount} remain.\n> Goodbye time: ${timestamp}`,
    (userName, groupMembersCount, timestamp) => `> @${userName} has moved on.\n> We are now ${groupMembersCount} members.\n> Time: ${timestamp}`,
    (userName, groupMembersCount, timestamp) => `@${userName} has left the group. 😢\n> Now only ${groupMembersCount} remain.\n> Left at: ${timestamp}`,
    (userName, groupMembersCount, timestamp) => `Sad to see you go, @${userName}.\n> ${groupMembersCount} of us remain.\n> Departure: ${timestamp}`
];

// 10 Demote variations
const demoteMessages = [
    (demoter, userName, timestamp, groupName) => `*Admin Event*\n\n@${demoter} has stripped @${userName} of admin rights. 👀😬\nTime: ${timestamp}\n*Group:* ${groupName}`,
    (demoter, userName, timestamp, groupName) => `⚠️ @${userName} was demoted by @${demoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (demoter, userName, timestamp, groupName) => `@${userName} is no longer an admin, thanks to @${demoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (demoter, userName, timestamp, groupName) => `Oops! @${userName} lost admin status via @${demoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (demoter, userName, timestamp, groupName) => `A change in leadership: @${demoter} demoted @${userName}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (demoter, userName, timestamp, groupName) => `@${demoter} has removed @${userName} from admin duties.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (demoter, userName, timestamp, groupName) => `🔻 @${userName} was demoted by @${demoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (demoter, userName, timestamp, groupName) => `Admin role removed: @${userName} (by @${demoter}).\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (demoter, userName, timestamp, groupName) => `@${userName} is back to normal member. Demoted by @${demoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (demoter, userName, timestamp, groupName) => `*Admin Update*\n@${userName} was demoted by @${demoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`
];

// 10 Promote variations
const promoteMessages = [
    (promoter, userName, timestamp, groupName) => `*Admin Event*\n\n@${promoter} has promoted @${userName} to admin. 🎉\nTime: ${timestamp}\n*Group:* ${groupName}`,
    (promoter, userName, timestamp, groupName) => `🔥 @${userName} is now an admin! Promoted by @${promoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (promoter, userName, timestamp, groupName) => `Congrats @${userName}! You are now an admin, courtesy of @${promoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (promoter, userName, timestamp, groupName) => `Leadership boost: @${promoter} promoted @${userName}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (promoter, userName, timestamp, groupName) => `@${userName} joins the admin team! Promoted by @${promoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (promoter, userName, timestamp, groupName) => `🎉 Cheers! @${userName} became admin (thanks @${promoter}).\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (promoter, userName, timestamp, groupName) => `Power up! @${promoter} gave admin to @${userName}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (promoter, userName, timestamp, groupName) => `Big news: @${userName} is now admin! Promoted by @${promoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (promoter, userName, timestamp, groupName) => `@${userName} has been trusted as admin by @${promoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`,
    (promoter, userName, timestamp, groupName) => `*Admin Update*\n@${userName} promoted by @${promoter}.\nTime: ${timestamp}\nGroup: *${groupName}*`
];

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants || [];
        const desc = metadata.desc || "No Description";
        const groupMembersCount = metadata.participants.length;
        const timestamp = new Date().toLocaleString();
        const verifiedContact = getVerifiedContact();

        for (const num of participants) {
            const userName = num.split("@")[0];

            // Get profile picture with fallback
            const ppUrl = await getProfilePicture(conn, num).catch(async () => {
                return await getProfilePicture(conn, update.id);
            });

            if (update.action === "add" && config.WELCOME === "true") {
                const msgIndex = Math.floor(Math.random() * welcomeMessages.length);
                const WelcomeText = welcomeMessages[msgIndex](userName, metadata.subject, groupMembersCount, desc);

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [num],
                    contextInfo: getContextInfo(num)
                }, { quoted: verifiedContact });

            } else if (update.action === "remove" && config.GOODBYE === "true") {
                const msgIndex = Math.floor(Math.random() * goodbyeMessages.length);
                const GoodbyeText = goodbyeMessages[msgIndex](userName, groupMembersCount, timestamp);

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [num],
                    contextInfo: getContextInfo(num)
                }, { quoted: verifiedContact });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author.split("@")[0];
                const msgIndex = Math.floor(Math.random() * demoteMessages.length);
                const status = demoteMessages[msgIndex](demoter, userName, timestamp, metadata.subject);

                await conn.sendMessage(update.id, {
                    text: status,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo(update.author)
                }, { quoted: verifiedContact });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author.split("@")[0];
                const msgIndex = Math.floor(Math.random() * promoteMessages.length);
                const status = promoteMessages[msgIndex](promoter, userName, timestamp, metadata.subject);

                await conn.sendMessage(update.id, {
                    text: status,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo(update.author)
                }, { quoted: verifiedContact });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;