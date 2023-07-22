import Env from "@ioc:Adonis/Core/Env";
const xmpp = require("simple-xmpp");

xmpp.connect({
  jid: Env.get("EJABBERD_JID"),
  password: Env.get("EJABBERD_PASSWORD"),
  host: Env.get("EJABBERD_HOST"),
  port: Env.get("EJABBERD_PORT"),
});

xmpp.on("error", (error) => console.log(error));


export default xmpp;
