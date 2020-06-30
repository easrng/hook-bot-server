const Eris = require("eris");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");
const fetch = require("node-fetch");
const logo=(async()=>(await(await fetch("https://cdn.glitch.com/da42cca1-aa45-48ab-b006-b0230741cffc%2Fdownload%20(10).png?v=1593006746068")).buffer()).toString("base64"))()
const url="https://hook-bot.glitch.me"
app.use(bodyParser.json());
const mappings = {};
app.post("/webhook/:id", async (req, res) => {
  res.end()
  let channel=mappings[req.params.id];
  let hook=(await channel.getWebhooks()).filter(e=>e.name=="HookBot")[0]
  if(!hook) hook=await channel.createWebhook({
    name:"HookBot",
    avatar:"data:image/png;base64,"+await logo
  }, "Needed to send messages.")
  fetch(`https://discord.com/api/webhooks/${hook.id}/${hook.token}`,{
    body:JSON.stringify(req.body),
    headers:{
      "content-type":"application/json"
    },
    method:"POST"
  })
  
  //.createMessage(req.body.body)
});
app.listen(process.env.PORT, () =>
  console.log("Your app is listening on port " + process.env.PORT)
);

const bot = new Eris(process.env.DISCORD_BOT_TOKEN); // Replace DISCORD_BOT_TOKEN in .env with your bot accounts token

bot.on("ready", () => {
  // When the bot is ready
  console.log("Ready!");
});
var s;
bot.on("messageCreate", async msg => {
  if(msg.author.bot) return;
  let id = (() => {
    for (let i in mappings) if (mappings[i].id == msg.channel.id) return i;
  })();
  if (!id) {
    id = uuid.v4();
    mappings[id] = msg.channel;
  }
  await(await fetch("https://hook-bot-backend.glitch.me/message",{
    body:(JSON.stringify({
      body:msg.content,
      response:url+"/webhook/"+id,
      server:msg.guildID,
      user:msg.author.id,
      manager:msg.channel.permissionsOf(msg.author.id).has("manageGuild")
    })),
    headers:{
      "content-type":"application/json"
    },
    method:"POST"
  })).text()
});

bot.connect(); // Get the bot to connect to Discord  
console.log("Connecting...")