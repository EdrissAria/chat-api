import { Client } from "node-xmpp-client";
import Env from '@ioc:Adonis/Core/Env'

const server = new Client({
  jid: Env.get('EJABBERD_JID'),
  password: Env.get('EJABBERD_PASSWORD'),
  host: Env.get('EJABBERD_HOST'),
  port: Env.get('EJABBERD_PORT'),
});

server.on("error", (error) => {
  console.error("XMPP error:", error);
});

// Connect to the ejabberd server
server.connect();

export default server;
