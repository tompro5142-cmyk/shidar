const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const fs = require('fs');
const path = require('path');

// Utility: builds contextInfo for menu replies
function commonContextInfo(jid) {
    return {
        mentionedJid: [jid],
        forwardingScore: 999,
        isForwarded: true
    };
}

// Get random image from /src for menu image
const getRandomImage = () => {
    try {
        const srcPath = path.join(__dirname, '../src');
        const files = fs.readdirSync(srcPath);
        const imageFiles = files.filter(file => 
            file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
        );
        
        if (imageFiles.length === 0) {
            console.log('No image files found in src folder');
            return 'https://files.catbox.moe/oli59a.jpg'; 
        }
        
        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        return path.join(srcPath, randomImage);
    } catch (e) {
        console.log('Error getting random image:', e);
        return 'https://files.catbox.moe/mn9fgn.jpg'; 
    }
};

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const totalCommands = Object.keys(commands).length;
        const menuCaption = `🌟 *Good ${
  new Date().getHours() < 12 ? 'Morning' : 
  (new Date().getHours() < 18 ? 'Afternoon' : 'Evening')
}, ${pushname}!* 🌟
╭━━《 *VERONICA AI* 》 ━━┈⊷
┃❍⁠⁠⁠⁠╭────────────
┃❍⁠⁠⁠⁠│▸  Usᴇʀ : ${config.OWNER_NAME}
┃❍⁠⁠⁠⁠│▸  ʙᴀɪʟᴇʏs : 𝐌𝐮𝐥𝐭𝐢 𝐝𝐞𝐯𝐢𝐜𝐞
┃❍⁠⁠⁠⁠│▸  ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅs : *${totalCommands}*
┃❍⁠⁠⁠⁠│▸  𝖳ʏᴘᴇ : 𝐍𝐨𝐝𝐞𝐣𝐬
┃❍⁠⁠⁠⁠│▸  ᴘʟᴀᴛғᴏʀᴍ : 𝐇𝐞𝐫𝐨𝐤𝐮
┃❍⁠⁠⁠⁠│▸  𝖣ᴇᴠᴇʟᴼᴘᴇʀ : ᴛᴇʀʀɪ
┃❍⁠⁠⁠⁠│▸  𝖬ᴏᴅᴇ : [${config.MODE}]
┃❍⁠⁠⁠⁠│▸  𝖯ʀᴇғɪx : *[${config.PREFIX}]*
┃❍⁠⁠⁠⁠│▸  ᴛɪᴍᴇ : *${new Date().toLocaleTimeString()}*
┃❍⁠⁠⁠⁠│▸  𝖵ᴇʀsɪᴏɴ : 𝟏.𝟎.𝟎
┃❍⁠⁠⁠⁠╰───────────
╰━━━━━━━━━━━━━┈⊷
📚 *ᴍᴇɴᴜ ɴᴀᴠɪɢᴀᴛɪᴏɴ*

*╭── [ MENU OPTION🌟] ‎─┈⊷*
‎*├⬡ 1. 📖 Quran Menu*
‎*├⬡ 2. ⚙️ Setting Menu*
‎*├⬡ 3. 🤖 AI Menu*
‎*├⬡ 4. 🎭 Anime Menu*
‎*├⬡ 5. 😹 Reactions*
‎*├⬡ 6. 🔁 Convert Menu*
‎*├⬡ 7. 🎉 Fun Menu*
‎*├⬡ 8. ⬇️ Download Menu*
‎*├⬡ 9. 👥 Group Menu*
‎*├⬡ 10. 🏠 Main Menu*
‎*├⬡ 11. 👑 Owner Menu*
‎*├⬡ 12. 🏦 M-Pesa Menu*
‎*├⬡ 13. 🧩 Other Menu*
‎*├⬡ 14. 🖌️ Logo Menu*
‎*├⬡ 15. 💻 Code Menu*
‎*╰─────────────┈⊷*

fσr mσrє ínfσ tчpє *.ownєr*
> ${config.DESCRIPTION}`;

        const terri = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "VERONICA MENU",
                    vcard: "BEGIN:VCARD\nVERSION:3.0\nFN: Terri\nORG:VERONICA BOT;\nTEL;type=CELL;type=VOICE;waid=93775551335:+256784670936\nEND:VCARD"
                }
            }
        };
        
        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363397100406773@newsletter',
                newsletterName:'WELCOME TO VERONICA AI MENU',
                serverMessageId: 143
            }
        };
        
        const audioUrls = [
            'https://files.catbox.moe/0yaito.mp3'
        ];

        const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];

        // Send image first
        const sentMsg = await conn.sendMessage(
            from, 
            { 
                image: { url: getRandomImage() }, 
                caption: menuCaption,
                contextInfo: contextInfo 
            }, 
            { quoted: terri }
        );

        // Then send audio
        await conn.sendMessage(from, {
            audio: { url: randomAudioUrl },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: terri });

        const messageID = sentMsg.key.id;

        // Menu content map for each section, merged and deduplicated
        const menuData = {
            '1': {
                title: "📖 Quran Menu",
                content: `
*╭────⬡ QURAN MENU ⬡────*
*├▢ • surah <number>*
*├▢ • ayat <surah:verse>*
*├▢ • tafsir <surah>*
*├▢ • listreciters*
*├▢ • play <reciter> <surah>*
*├▢ • searchquran <query>*
*├▢ • quranpdf <surah>*
*├▢ • prayer <city>*
*├▢ • setlocation <city>*
*├▢ • mylocation*
*├▢ • prayerfull <city>*
*├▢ • prayernext <city>*
*├▢ • hijridate*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '2': {
                title: "⚙️ Setting Menu",
                content: `
*╭────⬡ SETTING MENU ⬡────*
*├▢ .prefix new prefix*
*├▢ .botname new name*
*├▢ .ownername new name*
*├▢ .botimage reply to image*
*├▢ .mode public/private*
*├▢ .autoreact on/off*
*├▢ .autoreply on/off*
*├▢ .autosticker on/off*
*├▢ .autotyping on/off*
*├▢ .autostatusview on/off*
*├▢ .autostatusreact on/off*
*├▢ .autostatusreply on/off*
*├▢ .autorecoding on/off*
*├▢ .alwaysonline on/off*
*├▢ .welcome on/off*
*├▢ .goodbye on/off*
*├▢ .antilink on/off*
*├▢ .antilinkkick on/off*
*├▢ .deletelink on/off*
*├▢ .antibad on/off*
*├▢ .antibot on/off*
*├▢ .read-message on/off*
*├▢ .mention-reply on/off*
*├▢ .admin-action on/off*
*├▢ .creact on/off*
*├▢ .cemojis ❤️,🧡,💛*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '3': {
                title: "🤖 AI Menu",
                content: `
*╭────⬡ AI MENU ⬡────*
*├▢ • ai <query>*
*├▢ • gpt <query>*
*├▢ • gpt2 <query>*
*├▢ • gpt3 <query>*
*├▢ • gpt4 <query>*
*├▢ • bard <query>*
*├▢ • bing <query>*
*├▢ • copilot <query>*
*├▢ • imagine <prompt>*
*├▢ • imagine2 <prompt>*
*├▢ • blackbox <query>*
*├▢ • luma <query>*
*├▢ • meta <query>*
*├▢ • khan <query>*
*├▢ • jawad <query>*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '4': {
                title: "🎭 Anime Menu",
                content: `
*╭────⬡ ANIME MENU ⬡────*
*├▢ • waifu*
*├▢ • neko*
*├▢ • loli*
*├▢ • maid*
*├▢ • animegirl*
*├▢ • animeboy*
*├▢ • animenews*
*├▢ • animequote*
*├▢ • naruto*
*├▢ • animewall*
*├▢ • animememe*
*├▢ • anime1*
*├▢ • anime2*
*├▢ • anime3*
*├▢ • anime4*
*├▢ • anime5*
*├▢ • fack*
*├▢ • dog*
*├▢ • awoo*
*├▢ • garl*
*├▢ • megnumin*
*├▢ • foxgirl*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '5': {
                title: "😹 Reactions Menu",
                content: `
*╭────⬡ REACTIONS ⬡────*
*├▢ • bully @tag*
*├▢ • cuddle @tag*
*├▢ • hug @tag*
*├▢ • kiss @tag*
*├▢ • lick @tag*
*├▢ • pat @tag*
*├▢ • slap @tag*
*├▢ • kick @tag*
*├▢ • poke @tag*
*├▢ • bite @tag*
*├▢ • yeet @tag*
*├▢ • blush @tag*
*├▢ • smile @tag*
*├▢ • wave @tag*
*├▢ • highfive @tag*
*├▢ • handhold @tag*
*├▢ • cry @tag*
*├▢ • smug @tag*
*├▢ • bonk @tag*
*├▢ • nom @tag*
*├▢ • glomp @tag*
*├▢ • kill @tag*
*├▢ • happy @tag*
*├▢ • wink @tag*
*├▢ • dance @tag*
*├▢ • cringe @tag*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '6': {
                title: "🔁 Convert Menu",
                content: `
*╭────⬡ CONVERT MENU ⬡────*
*├▢ • sticker <image>*
*├▢ • sticker2 <video>*
*├▢ • tomp3 <video>*
*├▢ • tomp4 <audio>*
*├▢ • tts <text>*
*├▢ • trt <text> <lang>*
*├▢ • base64 <text>*
*├▢ • unbase64 <text>*
*├▢ • binary <text>*
*├▢ • dbinary <binary>*
*├▢ • tinyurl <url>*
*├▢ • emojimix <emoji+emoji>*
*├▢ • fancy <text>*
*├▢ • take <name,text>*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '7': {
                title: "🎉 Fun Menu",
                content: `
*╭────⬡ FUN MENU ⬡────*
*├▢ • joke*
*├▢ • meme*
*├▢ • fact*
*├▢ • quote*
*├▢ • truth*
*├▢ • dare*
*├▢ • ship @tag1 @tag2*
*├▢ • rate <something>*
*├▢ • hack @tag*
*├▢ • character*
*├▢ • pickup*
*├▢ • wyr*
*├▢ • wouldyourather*
*├▢ • insult*
*├▢ • compatibility*
*├▢ • aura*
*├▢ • roast*
*├▢ • compliment*
*├▢ • lovetest*
*├▢ • emoji*
*├▢ • ringtone*
*├▢ • hrt*
*├▢ • hpy*
*├▢ • syd*
*├▢ • anger*
*├▢ • shy*
*├▢ • mon*
*├▢ • cunfuzed*
*├▢ • setpp*
*├▢ • hand*
*├▢ • nikal*
*├▢ • hold*
*├▢ • hug*
*├▢ • hifi*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '8': {
                title: "⬇️ Download Menu",
                content: `
*╭────⬡ DOWNLOAD MENU ⬡────*
*├▢ • ytmp3 <url>*
*├▢ • ytmp4 <url>*
*├▢ • fb <url>*
*├▢ • fb2 <url>*
*├▢ • fb3 <url>*
*├▢ • tiktok <url>*
*├▢ • insta <url>*
*├▢ • twitter <url>*
*├▢ • spotify <url>*
*├▢ • play <query>*
*├▢ • play2 <query>*
*├▢ • play3 <query>*
*├▢ • play4 <query>*
*├▢ • play5 <query>*
*├▢ • playx <query>*
*├▢ • mediafire <url>*
*├▢ • gdrive <url>*
*├▢ • apk*
*├▢ • img*
*├▢ • pdf*
*├▢ • sss*
*├▢ • song*
*├▢ • darama*
*├▢ • git*
*├▢ • smovie*
*├▢ • baiscope*
*├▢ • ginisilia*
*├▢ • bible*
*├▢ • xxx*
*├▢ • mp3*
*├▢ • mp4*
*├▢ • gemini*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '9': {
                title: "👥 Group Menu",
                content: `
*╭────⬡ GROUP MENU ⬡────*
*├▢ • add @tag*
*├▢ • kick @tag*
*├▢ • promote @tag*
*├▢ • demote @tag*
*├▢ • grouplink*
*├▢ • revoke*
*├▢ • setname <text>*
*├▢ • setdesc <text>*
*├▢ • setwelcome <text>*
*├▢ • setgoodbye <text>*
*├▢ • welcome on/off*
*├▢ • goodbye on/off*
*├▢ • lockgc*
*├▢ • unlockgc*
*├▢ • mute*
*├▢ • unmute*
*├▢ • tagall*
*├▢ • tagadmins*
*├▢ • hidetag <text>*
*├▢ • kickall*
*├▢ • kickall2*
*├▢ • kickall3*
*├▢ • remove*
*├▢ • dismiss*
*├▢ • getpic*
*├▢ • ginfo*
*├▢ • delete*
*├▢ • disappear on*
*├▢ • disappear off*
*├▢ • disappear 7D,24H*
*├▢ • allreq*
*├▢ • updategname*
*├▢ • updategdesc*
*├▢ • joinrequests*
*├▢ • senddm*
*├▢ • invite*
*├▢ • tag*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '10': {
                title: "🏠 Main Menu",
                content: `
*╭────⬡ MAIN MENU ⬡────*
*├▢ • ping*
*├▢ • runtime*
*├▢ • uptime*
*├▢ • speedtest*
*├▢ • owner*
*├▢ • support*
*├▢ • menu*
*├▢ • menu2*
*├▢ • listcmd*
*├▢ • allmenu*
*├▢ • live*
*├▢ • alive*
*├▢ • repo*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '11': {
                title: "👑 Owner Menu",
                content: `
*╭────⬡ OWNER MENU ⬡────*
*├▢ • broadcast <message>*
*├▢ • ban @tag*
*├▢ • unban @tag*
*├▢ • block @tag*
*├▢ • unblock @tag*
*├▢ • join <link>*
*├▢ • leave*
*├▢ • setpp <image>*
*├▢ • fullpp*
*├▢ • shutdown*
*├▢ • restart*
*├▢ • update*
*├▢ • getsudo*
*├▢ • addsudo @tag*
*├▢ • delsudo @tag*
*├▢ • banlist*
*├▢ • gjid*
*├▢ • jid @user*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '12': {
                title: "🏦 M-Pesa Menu",
                content: `
*╭───❍「 SUPPORT 」❍*
*├⬡ .airtelmoney*
*├⬡ .mpesa*
*╰───────────────❍
> ${config.DESCRIPTION}`,
                image: true
            },
            '13': {
                title: "🧩 Other Menu",
                content: `
*╭────⬡ OTHER MENU ⬡────*
*├▢ • weather <location>*
*├▢ • news*
*├▢ • movie <name>*
*├▢ • wikipedia <query>*
*├▢ • define <word>*
*├▢ • currency <amount> <from> <to>*
*├▢ • calculator <expression>*
*├▢ • flip*
*├▢ • roll*
*├▢ • fact*
*├▢ • rcolor*
*├▢ • countdown <seconds>*
*├▢ • remind <time> <message>*
*├▢ • vv*
*├▢ • pair*
*├▢ • pair2*
*├▢ • font*
*├▢ • srepo*
*├▢ • save*
*├▢ • githubstalk*
*├▢ • yts*
*├▢ • ytv*
*├▢ • gpass*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '14': {
                title: "🖌️ Logo Menu",
                content: `
*╭────⬡ LOGO MENU ⬡────*
*├▢ • neonlight <text>*
*├▢ • blackpink <text>*
*├▢ • dragonball <text>*
*├▢ • 3dcomic <text>*
*├▢ • america <text>*
*├▢ • naruto <text>*
*├▢ • sadgirl <text>*
*├▢ • clouds <text>*
*├▢ • futuristic <text>*
*├▢ • 3dpaper <text>*
*├▢ • eraser <text>*
*├▢ • sunset <text>*
*├▢ • leaf <text>*
*├▢ • galaxy <text>*
*├▢ • sans <text>*
*├▢ • boom <text>*
*├▢ • hacker <text>*
*├▢ • devilwings <text>*
*├▢ • nigeria <text>*
*├▢ • bulb <text>*
*├▢ • angelwings <text>*
*├▢ • zodiac <text>*
*├▢ • luxury <text>*
*├▢ • paint <text>*
*├▢ • frozen <text>*
*├▢ • castle <text>*
*├▢ • tatoo <text>*
*├▢ • valorant <text>*
*├▢ • bear <text>*
*├▢ • typography <text>*
*├▢ • birthday <text>*
*╰────────────────*
> ${config.DESCRIPTION}`,
                image: true
            },
            '15': {
                title: "💻 Code Menu",
                content: `
*╭───❍CODE MENU❍*──
*├⬡ .gitstalk*
*├⬡ .terminate*
*├⬡ .unbase*
*├⬡ .base*
*├⬡ .colour*
*╰─────────────❍*
> ${config.DESCRIPTION}`,
                image: true
            }
        };

        // Handler for replies to menu
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;
                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation ||
                        receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;
                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        if (selectedMenu.image) {
                            await conn.sendMessage(
                                senderID,
                                {
                                    image: { url: config.MENU_IMAGE_URL || getRandomImage() },
                                    caption: selectedMenu.content,
                                    contextInfo: commonContextInfo(receivedMsg.key.participant || receivedMsg.key.remoteJid)
                                },
                                { quoted: receivedMsg }
                            );
                        } else {
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: commonContextInfo(receivedMsg.key.participant || receivedMsg.key.remoteJid) },
                                { quoted: receivedMsg }
                            );
                        }
                        await conn.sendMessage(senderID, {
                            react: { text: '✅', key: receivedMsg.key }
                        });
                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `Invalid selection. Please reply with a number between 1-15.`,
                                contextInfo: commonContextInfo(receivedMsg.key.participant || receivedMsg.key.remoteJid)
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Listen for replies
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `Menu system is currently busy. Please try again later📛.\n\n> ${config.DESCRIPTION}` },
                { quoted: terri }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});