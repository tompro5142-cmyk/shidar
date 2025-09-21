const fetch = require('node-fetch');
const yts = require('yt-search');
const { cmd } = require('../command');
const { anony } = require('../lib/terri');

function isYoutubeUrl(str) {
    return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(str);
}

function sanitizeFilename(title, ext = '') {
    return (title || 'audio')
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .substring(0, 64) + ext;
}

// --- YTMP3 Command (Nekolabs API) ---
cmd({
    pattern: "ytmp3",
    alias: ["ytmp3", "song", "audio"],
    desc: "Download YouTube audio (MP3)",
    category: "main",
    use: ".ytmp3 <song name or url>",
    react: "🔰",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❗ Please provide a song name or YouTube URL.");

        // Get YouTube URL (search if not a direct URL)
        let ytUrl = q;
        if (!isYoutubeUrl(q)) {
            const searchResults = await yts(q);
            if (!searchResults.videos || !searchResults.videos.length) {
                return reply("❌ No audio found with that name.");
            }
            ytUrl = searchResults.videos[0].url;
        }

        // Call Nekolabs API
        const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(ytUrl)}&format=mp3`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.result?.download) {
            return reply("❌ Failed to download audio. API error.");
        }

        // Send cover image first (optional)
        if (data.result.cover) {
            await conn.sendMessage(from, {
                image: { url: data.result.cover },
                caption: `🎵 *${data.result.title}*\n⏳ ${data.result.duration}\n📊 Quality: ${data.result.quality}kbps\nPowered by Terri`
            }, { quoted: anony });
        }

        await conn.sendMessage(from, {
            audio: { url: data.result.download },
            mimetype: "audio/mpeg",
            fileName: sanitizeFilename(data.result.title, '.mp3')
        }, { quoted: anony });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("⚠️ Error occurred. Try again.");
    }
});

// --- YTMP4 Command (Zenzzxz API) ---
cmd({
    pattern: "ytmp4",
    alias: ["ytmp4", "video"],
    desc: "Download YouTube video (MP4)",
    category: "main",
    use: ".ytmp4 <video name or url>",
    react: "🔰",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❗ Please provide a video/song name or YouTube URL.");

        // Get YouTube URL (search if not a direct URL)
        let ytUrl = q;
        if (!isYoutubeUrl(q)) {
            const searchResults = await yts(q);
            if (!searchResults.videos || !searchResults.videos.length) {
                return reply("❌ No video found with that name.");
            }
            ytUrl = searchResults.videos[0].url;
        }

        // Call Zenzzxz API
        const apiUrl = `https://api.zenzxz.my.id/downloader/ytmp4?url=${encodeURIComponent(ytUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.download_url) return reply("❌ Failed to download video. API error.");

        await conn.sendMessage(from, {
            video: { url: data.download_url },
            mimetype: "video/mp4",
            caption: `📽️ *${data.title}*\n⏳ ${data.duration}s\n📊 Quality: ${data.format}\n🎨 By: Terri`
        }, { quoted: anony });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("⚠️ Error occurred. Try again.");
    }
});

// --- PLAY Command (only document mp3) ---
cmd({
    pattern: "play",
    alias: ["audio", "yta"],
    react: "🎵",
    desc: "Download YouTube audio (document MP3 only)",
    category: "downloader",
    use: ".play <song name or url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("🎵 Please provide video name");

        let ytUrl = q;
        if (!isYoutubeUrl(q)) {
            const searchResults = await yts(q);
            if (!searchResults.videos || !searchResults.videos.length) {
                return reply("No results found");
            }
            ytUrl = searchResults.videos[0].url;
        }

        const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(ytUrl)}&format=mp3`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.result?.download) {
            return reply("Audio download failed");
        }

        const filename = sanitizeFilename(data.result.title, '.mp3');

        await conn.sendMessage(from, {
            document: { url: data.result.download },
            mimetype: 'audio/mpeg',
            fileName: filename
        }, { quoted: anony });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("Error occurred while downloading audio");
    }
});


cmd({
    pattern: "play2",
    alias: ["yta2", "song2"],
    react: "🎵",
    desc: "Download high quality YouTube audio via Nekolabs API",
    category: "media",
    use: ".play2 <song name or url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please provide a song name\nExample: .play2 Tum Hi Ho");

        let ytUrl = q;
        if (!isYoutubeUrl(q)) {
            const searchResults = await yts(q);
            if (!searchResults.videos || !searchResults.videos.length) {
                return reply("❌ No results found. Try a different search term.");
            }
            ytUrl = searchResults.videos[0].url;
        }

        const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(ytUrl)}&format=mp3`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.result?.download) return reply("❌ Failed to fetch audio. Try again later.");

        if (data.result.cover) {
            await conn.sendMessage(from, {
                image: { url: data.result.cover },
                caption: `*YT AUDIO DOWNLOADER*\n╭━━❐━⪼\n┇๏ *Title*    –  ${data.result.title}\n┇๏ *Duration* –  ${data.result.duration}\n┇๏ *Quality*   –  ${data.result.quality || 'Unknown'}\n╰━━❑━⪼\n> *Downloading Audio File ♡*`
            }, { quoted: anony });
        }

        // Download the buffer
        const audioRes = await fetch(data.result.download);
        const arrayBuffer = await audioRes.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        await conn.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: sanitizeFilename(data.result.title, '.mp3')
        }, { quoted: anony });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error('Play2 command error:', error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("⚠️ An unexpected error occurred. Please try again.");
    }
});