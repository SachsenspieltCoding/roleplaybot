import fs from "fs";
import lodash from "lodash";
import { logger } from "./Bot";
import { RegisteredUser } from "./class/RegisteredUser";

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
        new Date(lodash.get(object, "timestamp"))
      );

      for (const msgid of lodash.get(object, "ownerMessagesIds")) {
        registration.addOwnerMessage(msgid);
      }

      this.add(registration);
    }

    return this;
  }
}

class IdCards extends Database implements DatabaseBaseFunctions {
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

class DriversLicenses extends Database implements DatabaseBaseFunctions {
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
const driversLicenses = new DriversLicenses("driversLicenses");
const licensePlates = new LicensePlates("licensePlates");

function loadDatabases(): void {
  logger.info("Loading databases...");
  registeredUsers.load();
  idCards.load();
  driversLicenses.load();
  licensePlates.load();
  logger.info("Successfully loaded databases.");
}

export {
  registeredUsers,
  idCards,
  driversLicenses,
  licensePlates,
  loadDatabases,
};
