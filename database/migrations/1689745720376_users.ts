import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("username").unique()
      table.string("password")
      table.enum("presence", ["Available", "Unavailable", "Away", "Do_Not_Disturb", "Extended_Away", "Offline"])
      table.string("key", 64).notNullable().unique();
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
