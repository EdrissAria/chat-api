import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(()=>{
  Route.post("/create-user", "UsersController.createUser")
  Route.post("/create-client", "UsersController.createClient")
  Route.post("/send-message", "UsersController.sendMessage")
}).prefix("api")
