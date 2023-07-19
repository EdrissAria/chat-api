import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import server from "xmpp-server";
import {Client, xml} from "node-xmpp-client"
import Database from "@ioc:Adonis/Lucid/Database";
import Env from '@ioc:Adonis/Core/Env'

export default class ChatsController {

  public async register({ request, response }: HttpContextContract) {
    const { username, password } = request.body();
    
    server.on('online', () => {
      console.log('Connected to ejabberd server')

      // Register the user
      server.register(
        {
          jid: username + Env.get('EJABBERD_HOST'),
          password,
        },
        (error) => {
          if (error) {
            console.error('User registration error:', error)
            return response.status(500).json({ message: 'User registration failed' })
          }

          console.log('User registered successfully')

          server.end()

          return response.json({ message: 'User registered successfully' })
        }
      )
    })
  }

  public async login({ request, response }: HttpContextContract) {
    const { username, password } = request.body()

    const client = new Client({
      jid: username + '@' + Env.get('EJABBERD_HOST'), 
      password,
      host: Env.get('EJABBERD_HOST'),
      port: Env.get('EJABBERD_PORT'),
    })

    client.on('online', () => {
      console.log('User logged in successfully')

      client.end()

      return response.json({ message: 'User logged in successfully' })
    })

    client.on('error', (error) => {
      console.error('XMPP error:', error)
      return response.status(500).json({ message: 'User login failed' })
    })

    client.connect()
  }

  public async sendMessage({ request, response }: HttpContextContract) {
    const { sender, recipient, message } = request.body();

    const client = new Client({
      jid: sender + '@' + Env.get('EJABBERD_HOST'), 
      password: 'senderpassword', 
      host: Env.get('EJABBERD_HOST'),
      port: Env.get('EJABBERD_PORT'),
    })

    client.on('online', () => {
      console.log('Connected to ejabberd server')

      // Send the message
      const stanza = xml(
        'message',
        { to: recipient + '@' + Env.get('EJABBERD_HOST'), type: 'chat' },
        xml('body', {}, message)
      )
      client.send(stanza)

      console.log('Message sent successfully')

      client.end()

      return response.json({ message: 'Message sent successfully' })
    })

    client.on('error', (error) => {
      console.error('XMPP error:', error)
      return response.status(500).json({ message: 'Failed to send message' })
    })

    client.connect()
  }

  public async getChatHistory({ request, response }: HttpContextContract) {
    const { user } = request.qs();
    try {
      const messages = await Database.query()
        .from('messages')
        .where('sender', user)
        .orWhere('recipient', user)
        .orderBy('created_at', 'asc')

      return response.json({ messages })
    } catch (error) {
      console.error('Error retrieving chat history:', error)
      return response.status(500).json({ message: 'Failed to retrieve chat history' })
    }
  }
  

  public async updatePresence({ request, response }: HttpContextContract) {
    const { user, presence } = request.body();
    try {

      await Database.from('users')
        .where('username', user)
        .update({ presence })

      return response.json({ message: 'User presence updated successfully' })
    } catch (error) {
      console.error('Error updating user presence:', error)
      return response.status(500).json({ message: 'Failed to update user presence' })
    }
  }  
}
