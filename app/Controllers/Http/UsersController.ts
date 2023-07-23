import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import xmpp from "../../../xmpp-server";
import { v4 as uuidv4 } from "uuid";
import Env from "@ioc:Adonis/Core/Env";

export default class UsersController {
  async createUser({ request, response }: HttpContextContract) {
    const data = request.body();

    const new_user = await User.create({ ...data, key: uuidv4() });

    response.json(new_user.key);
  }

  async createClient({ response, request }: HttpContextContract) {
    const key = request.input("key");

    const user = await User.query().where({ key }).first();

    if (user) {
      //add client in ejabberd

      xmpp.on("online", () => {
        console.log("online....");
        const iq = new xmpp.Element("stream:stream", {
          xmlns: "jabber:component:accept",
          "xmlns:stream": "http://etherx.jabber.org/streams",
          to: "localhost",
        })
          .c("iq", {
            type: "set",
            id: "reg2",
          })
          .c("query", {
            xmlns: "jabber:iq:register",
          })
          .c("username")
          .t(user.username)
          .up()
          .c("password")
          .t(user.password);

        xmpp.send(iq);
      });

      // Handle response
      xmpp.on("stanza", (stanza) => {
        if (stanza.is("presence")) {
          console.log("Connection established successfully");
        } else if (stanza.is("message") && stanza.attrs.type === "result") {
          console.log("User registered successfully");
        } else if (stanza.is("message") && stanza.attrs.type === "error") {
          const errorElement = stanza.getChild("error");
          const errorText = errorElement.getChildText("text");
          console.error("Error registering user:", errorText);
        }
      });
    }
  }

  public async sendMessage({ request, response }: HttpContextContract) {
    const { key, reciver, message } = request.body();

    const exists = await User.query().where({ key }).first();

    if (exists) {
      xmpp.send(reciver + "@" + Env.get("EJABBERD_HOST"), message);
    }
  }
}
