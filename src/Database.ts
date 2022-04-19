import fs from "fs";
import lodash from "lodash";
import { logger } from "./Bot";
import { OwnerMessage, RegisteredUser } from "./class/RegisteredUser";
import { IDCard } from "./class/IDCard";
import { randomUUID } from "crypto";
import { DriversLicense } from "./class/DriversLicense";

class Database {
  protected filename: string = "";

  constructor(filename: string) {
    this.filename = filename;
  }

  public saveToFile<T>(data: T[]): void {
    try {
      fs.writeFileSync(
        `./src/database/${this.filename}.json`,
        JSON.stringify(data, null, 2)
      );
    } catch (e) {
      logger.error(e);
    }
  }

  public loadFromFile(): Object[] {
    let parsed: Object[] = [];

    try {
      parsed = JSON.parse(
        fs.readFileSync(`./src/database/${this.filename}.json`, {
          encoding: "utf-8",
        })
      );
    } catch (e) {
      this.saveToFile([]);
    }

    return parsed;
  }
}

interface DatabaseBaseFunctions {
  add: () => this;
  remove: () => this;
  save: () => this;
  load: () => this;
}

class RegisteredUsers extends Database implements DatabaseBaseFunctions {
  public users: RegisteredUser[] = [];

  public add(...users: RegisteredUser[]): this {
    for (const user of users) {
      this.users.push(user);
    }
    return this;
  }

  public remove(...users: RegisteredUser[]): this {
    for (const user of users) {
      this.users = this.users.filter((r) => r.id !== user.id);
    }
    return this;
  }

  public get(id: string): RegisteredUser | null {
    const filteredUsers: RegisteredUser[] = this.users.filter(
      (u) => u.id === id
    );
    if (filteredUsers.length == 0) return null;
    return filteredUsers[0];
  }

  public getByUserId(id: string): RegisteredUser | null {
    const filteredUsers: RegisteredUser[] = this.users.filter(
      (u) => u.userid === id
    );
    if (filteredUsers.length == 0) return null;
    return filteredUsers[0];
  }

  public save(): this {
    this.saveToFile<RegisteredUser>(this.users);
    return this;
  }

  public load(): this {
    const objects: Object[] = this.loadFromFile();
    for (const object of objects) {
      const registration = new RegisteredUser(
        lodash.get(object, "id"),
        lodash.get(object, "userid"),
        lodash.get(object, "guildid"),
        lodash.get(object, "firstname"),
        lodash.get(object, "lastname"),
        lodash.get(object, "job"),
        new Date(lodash.get(object, "timestamp")),
        lodash.get(object, "pending")
      );

      for (const omsg of lodash.get(object, "ownerMessages")) {
        registration.addOwnerMessage(
          new OwnerMessage(
            lodash.get(omsg, "channelid"),
            lodash.get(omsg, "messageid")
          )
        );
      }

      this.add(registration);
    }

    return this;
  }
}

class IdCards extends Database implements DatabaseBaseFunctions {
  idcards: IDCard[] = [];

  public add(...idcards: IDCard[]): this {
    for (const idcard of idcards) {
      this.idcards.push(idcard);
    }
    return this;
  }

  public load(): this {
    const objects: Object[] = this.loadFromFile();
    for (const object of objects) {
      const driversLicense = lodash.get(object, "driversLicense");
      const idcard = new IDCard(
        lodash.get(object, "id"),
        lodash.get(object, "discordUserId"),
        lodash.get(object, "discordGuildId"),
        lodash.get(object, "firstname"),
        lodash.get(object, "lastname"),
        lodash.get(object, "birthday"),
        lodash.get(object, "nationality"),
        lodash.get(object, "hometown"),
        lodash.get(object, "placeOfBirth"),
        lodash.get(object, "authority"),
        lodash.get(object, "linkToImage"),
        new DriversLicense(
          lodash.get(driversLicense, "B"),
          lodash.get(driversLicense, "C"),
          lodash.get(driversLicense, "A1"),
          lodash.get(driversLicense, "AM"),
          lodash.get(driversLicense, "T"),
          lodash.get(driversLicense, "L")
        ),
        new Date(lodash.get(object, "createdAt"))
      );

      this.add(idcard);
    }

    return this;
  }

  public remove(...ids: string[]): this {
    for (const id of ids) {
      this.idcards = this.idcards.filter((i) => i.id !== id);
    }
    return this;
  }

  public save(): this {
    this.saveToFile<IDCard>(this.idcards);
    return this;
  }

  public get(firstname: string, lastname: string): IDCard | null {
    return this.idcards.filter(
      (card) => card.firstname === firstname && card.lastname === lastname
    )[0];
  }

  public getById(id: string): IDCard {
    return this.idcards.filter((card) => card.id === id)[0];
  }

  public getNewIdCardNumber(): string {
    return randomUUID().replaceAll("-", "");
  }
}

class LicensePlates extends Database implements DatabaseBaseFunctions {
  add(): this {
    return this;
  }

  load(): this {
    return this;
  }

  remove(): this {
    return this;
  }

  save(): this {
    return this;
  }
}

const registeredUsers = new RegisteredUsers("registeredUsers");
const idCards = new IdCards("idCards");
const licensePlates = new LicensePlates("licensePlates");

function loadDatabases(): void {
  logger.info("Loading databases...");
  registeredUsers.load();
  idCards.load();
  licensePlates.load();
  logger.info("Successfully loaded databases.");
}

export { registeredUsers, idCards, licensePlates, loadDatabases };
