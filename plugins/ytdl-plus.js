const config = require('../config');
const { cmd } = require('../command');
const { anony } = require('../lib/terri');
const yts = require('yt-search');

cmd({
  pattern: "songx",
  alias: ["ytmp4"],
  desc: "Download YouTube video (MP4)",
  category: "main",
  use: ".songx <video name>",
  react: "🔰",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("❗ Please provide a video/song name.");

    // ⏳ Processing reaction
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Search for the video using yt-search
    const searchResults = await yts(q);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ No video found with that name.");
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const apiUrl = `https://api.zenzxz.my.id/downloader/ytmp4?url=${encodeURIComponent(videoUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.status || !data.download_url) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ Failed to download video. API error.");
    }

    await conn.sendMessage(from, {
      video: { url: data.download_url },
      mimetype: "video/mp4",
      caption: `📽️ *${data.title}*\n⏳ ${data.duration} seconds\n📊 Quality: ${data.format}\n🎨 By: ${data.creator}`
    }, { quoted: anony });

    // ✅ Success reaction
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("⚠️ Error occurred. Try again.");
  }
});


cmd({
  pattern: "play4",
  alias: ["ytmp3"],
  desc: "Download YouTube song (MP3)",
  category: "main",
  use: ".play4 <song name>",
  react: "🔰",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("❗ Please provide a song name.");

    // ⏳ Processing reaction
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Search for the video using yt-search
    const searchResults = await yts(q);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ No audio found with that name.");
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    // Using the new API endpoint
    const apiUrl = `https://api.nexoracle.com/downloader/yt-audio2?apikey=MatrixZatKing&url=${encodeURIComponent(videoUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.status || !data.result?.audio) {
      await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
      return reply("❌ Failed to download audio. API error.");
    }

    await conn.sendMessage(from, {
      audio: { url: data.result.audio },
      mimetype: "audio/mpeg",
      fileName: `${data.result.title || video.title}.mp3`
    }, { quoted: anony });

    await reply(`🎵 *${data.result.title || video.title}*\n⏳ ${video.timestamp || "N/A"}\n📊 Quality: ${data.result.quality || 'MP3'}\nDownloaded Successfully ✅`);

    // ✅ Success reaction
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("⚠️ Error occurred. Try again.");
  }
});