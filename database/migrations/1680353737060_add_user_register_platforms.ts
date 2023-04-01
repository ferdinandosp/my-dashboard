import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('register_platform').notNullable().defaultTo('email')
    })
  }

  public async down () {
    // drop the column
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('register_platform')
    })
  }
}
