import fs from "fs";
import lodash from "lodash";
import { logger } from "./Bot";

class Record {
  public id: number;
  public record: Object;

  constructor(id: number, record: Object) {
    this.id = id;
    this.record = record;
  }
}

class Database {
  private data: Record[] = [];
  private readonly filename: string;

  constructor(filename: string, data: Record[]) {
    this.filename = filename;
    this.data = data;
  }

  public get getData(): Record[] {
    return this.data;
  }

  public add(...objects: Object[]): Database {
    for (const object of objects) {
      this.data.push(new Record(this.nextIndex(), object));
    }
    return this;
  }

  public nextIndex(): number {
    let number = 0;
    for (const record of this.data) {
      if (record.id >= number) number = record.id + 1;
    }
    return number;
  }

  public removeById(id: number): Database {
    this.data = this.data.filter((o: Record) => {
      o.id !== id;
    });
    return this;
  }

  public removeByObject(...objects: Object[]): Database {
    for (const object of objects) {
      this.data = this.data.filter(
        (o: Record) => !lodash.isEqual(o.record, object)
      );
    }
    return this;
  }

  public save(): Database {
    let toSave: Object[] = [];

    for (const object of this.data) {
      toSave.push(object.record);
    }

    try {
      fs.writeFileSync(
        `./src/database/${this.filename}.json`,
        JSON.stringify(toSave, null, 2)
      );
    } catch (e) {
      logger.error(e);
    }
    return this;
  }

  public load(): Database {
    let parsed: Object[] = [];

    try {
      parsed = JSON.parse(
        fs.readFileSync(`./src/database/${this.filename}.json`, {
          encoding: "utf-8",
        })
      );
    } catch (e) {
      this.save();
    }

    for (const element of parsed) {
      this.add(element);
    }
    return this;
  }
}

class RegisteredUsers extends Database {}

class IdCards extends Database {}

class DriversLicenses extends Database {}

class LicensePlates extends Database {}

const registeredUsers = new RegisteredUsers("registeredUsers", []);
const idCards = new IdCards("idCards", []);
const driversLicenses = new DriversLicenses("driversLicenses", []);
const licensePlates = new LicensePlates("licensePlates", []);

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
