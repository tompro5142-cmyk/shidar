const { cmd } = require('../command');
const config = require("../config");
const { anony } = require('../lib/terri');


// Anti-Bad Words System
cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply,
  sender
}) => {
  try {
    const badWords = [
  "ass", "asshole", "asses", "assholes", "bitch", "bitches", "bullshit", "crap", "cunt", "cunts", "damn", "dick", "dicks", "dumbass", "fuck", "fucker", "fucking", "fucked", "motherfucker", "motherfucking", "shit", "shitting", "piss", "pissing", "prick", "pricks", "pussy", "slut", "sluts", "whore", "whores", "retard", "retarded","sex", "xxx", "porn", "nude", "nudes", "dickpic", "dickpic", "cock", "cocks", "tits", "boobs", "blowjob", "handjob", "jerkoff", "orgy", "orgasm", "penis", "vagina", "bdsm", "fetish","fart", "farts", "farting", "poop", "pooping", "crap", "crapping", "butt", "butthole", "anal","nigger", "nigga", "niggers", "chink", "gook", "kike", "spic", "wetback", "gypsy", "paki", "raghead", "towelhead", "cracker", "redneck", "fag", "faggot", "fags", "dyke", "dykes", "tranny", "shemale", "homo", "queer", "poof", "lesbo", "retard", "retarded", "cripple", "midget", "spaz","huththa", "hutto", "pakaya", "ponnaya", "balla", "ballo", "gonna", "goni", "gona", "hariya", "oli", "oliya", "kella", "kellawa", "kellage", "kellageda", "pako", "pari", "karaya", "karaw", "bithara", "bithare", "thopi", "thoppi", "miniha", "minihawa", "gahaniya", "gahaniye", "bokke", "bokka", "bokka", "hukanna", "hukane", "otha", "othe", "musna", "musne", "vesi", "vesiya", "vesige", "vesigeda", "lanja", "lanje", "lansi", "lansee", "monada", "mokada", "moka", "pissu", "pissuwa", "pissune", "unama", "umba", "umbata", "umbaagen", "umbaagena","sootha", "sootha", "soothang", "punda", "pundai", "pundam", "poolu", "pool", "poola", "lingam", "linga", "kunja", "kunne", "kundi", "kundiman", "theriyadu", "theriyama", "mairu", "mayiru", "nayee", "naai", "pathti", "pathti", "keesu", "kees", "otha", "othe", "vesi", "vesiya", "molacha", "molachu"
];

    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }

    const messageText = body.toLowerCase();
    const containsBadWord = badWords.some(word => messageText.includes(word));

    if (containsBadWord && config.ANTI_BAD_WORD === 'true') {
      await conn.sendMessage(from, { 'delete': m.key }, { 'quoted': m });
      await conn.sendMessage(from, { 'text': "🚫 ⚠️ BAD WORDS NOT ALLOWED ⚠️ 🚫" }, { 'quoted': anony });
    }
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});

// Anti-Link System
const linkPatterns = [
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
  /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/,
  /wa\.me\/\S+/gi,
  /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
  /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
  /https?:\/\/youtu\.be\/\S+/gi,
  /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
  /https?:\/\/fb\.me\/\S+/gi,
  /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
  /https?:\/\/ngl\/\S+/gi,
  /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
  /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
];

cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }

    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && config.ANTI_LINK === 'true') {
      await conn.sendMessage(from, { 'delete': m.key }, { 'quoted': m });
      await conn.sendMessage(from, {
        'text': `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} has been removed. 🚫`,
        'mentions': [sender]
      }, { 'quoted': anony });

      await conn.groupParticipantsUpdate(from, [sender], "remove");
    }
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});
