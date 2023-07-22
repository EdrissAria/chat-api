import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import xmpp from "../../../xmpp-server";
import { v4 as uuidv4 } from "uuid";
import Env from '@ioc:Adonis/Core/Env'

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
  
    }
  }

  public async sendMessage({ request, response }: HttpContextContract) {
    const { key, reciver, message } = request.body();

    const exists = await User.query().where({ key }).first();

    if(exists){
      xmpp.send(
        reciver+"@"+Env.get('EJABBERD_HOST'), message);      
    }

  }
}
