const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const fetch = require('node-fetch');
const config = require('../config');    
const { cmd } = require('../command');

cmd({
    pattern: "script",
    alias: ["repo", "sc", "info"],
    desc: "Fetch information about a GitHub repository.",
    react: "🎗️",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply, pushname }) => {
    const githubRepoURL = 'https://github.com/Terrizev/VERONICA-AI';

    try {
        // Extract username and repo name from the URL
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/) || [];

        if (!username || !repoName) {
            throw new Error("Invalid GitHub URL format");
        }

        // Fetch repository details using GitHub API
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const repoData = await response.json();

        // Format the repository information
        const formattedInfo = `
*𝐇𝐄𝐋𝐋𝐎 𝐓𝐇𝐄𝐑𝐄 ᐯᗴᖇOᑎIᑕᗩ ᗩI 𝐔𝐒𝐄𝐑!😇👑* 

> *sɪᴍᴘʟᴇ, ɪᴄʏ, ᴄᴏʟᴅ  & ʀɪᴄʜ ʟᴏᴀᴅᴇᴅ ʙᴏᴛ ᴡɪᴛʜ ᴀᴍᴀᴢɪɴɢ ғᴇᴀᴛᴜʀᴇs,

*𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐔𝐒𝐄𝐈𝐍𝐆 VERONICA-AI🫶* 

> *ᴅᴏɴ'ᴛ ғᴏʀɢᴇᴛ ᴛᴏ sᴛᴀʀ & ғᴏʀᴋ ᴛʜᴇ ʀᴇᴘᴏ🌟🍴*

https://github.com/Terrizev/VERONICA-AI
──────────────────
${readMore}
\`BOT NAME:\`
> ${repoData.name}

\`OWNER NAME:\`👨‍💻
> ${repoData.owner.login}

\`STARS:\`🌟
> ${repoData.stargazers_count}

\`FORKS:\`🍴
> ${repoData.forks_count}
──────────────────
\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Terri* 🎐`;
  
        // Contact message for verified context
        const verifiedContact = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "VERONICA-AI REPO",
                    vcard: "BEGIN:VCARD\nVERSION:3.0\nFN: VERONICA\nORG:VERONICA-AI;\nTEL;type=CELL;type=VOICE;waid=93775551335:+256784670936\nEND:VCARD"
                }
            }
        };

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363397100406773@newsletter',
                newsletterName: '☇ Vᴇʀᴏɴɪᴄᴀ suppσrt  ⃪🤖͎᪳᪳𝆺𝅥',
                serverMessageId: 143
            }
        };

        // Send an image with the formatted info as a caption and context info
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/mn9fgn.jpg` },
            caption: formattedInfo,
            contextInfo: contextInfo
        }, { quoted: verifiedContact });

        // Send the audio file with context info
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/eqfc2j.mp3' },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: contextInfo
        }, { quoted: verifiedContact });

    } catch (error) {
        console.error("Error in repo command:", error);
        // Use conn.sendMessage as fallback if reply is not available
        try {
            if (typeof reply === 'function') {
                reply("Sorry, something went wrong while fetching the repository information. Please try again later.");
            } else {
                await conn.sendMessage(from, { 
                    text: "Sorry, something went wrong while fetching the repository information. Please try again later." 
                }, { quoted: mek });
            }
        } catch (sendError) {
            console.error("Failed to send error message:", sendError);
        }
    }
});