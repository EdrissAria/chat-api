import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public username: string;

  @column()
  public password: string;

  @column()
  public presence:
    | "Available"
    | "Unavailable"
    | "Away"
    | "Do_Not_Disturb"
    | "Extended_Away"
    | "Offline";

  @column()
  public key: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
