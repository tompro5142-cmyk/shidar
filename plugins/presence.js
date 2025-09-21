const config = require('../config');
const { cmd } = require('../command');

// Presence Control (Online/Offline)

cmd({
  on: "body"
}, async (conn, mek, m, { from }) => {
  try {
    
    if (config.ALWAYS_ONLINE === "true") {
      await conn.sendPresenceUpdate("available", from);
    }

  } catch (e) {
    console.error("[Presence Error]", e);
  }
});
