class RegisteredUser {
  private readonly _discordid: string;
  private readonly _firstname: string;
  private readonly _lastname: string;
  private readonly _job: string;
  private readonly _timestamp: Date;

  constructor(
    discordid: string,
    firstname: string,
    lastname: string,
    job: string
  ) {
    this._discordid = discordid;
    this._firstname = firstname;
    this._lastname = lastname;
    this._job = job;
    this._timestamp = new Date();
  }

  get discordid(): string {
    return this._discordid;
  }

  get firstname(): string {
    return this._firstname;
  }

  get lastname(): string {
    return this._lastname;
  }

  get job(): string {
    return this._job;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  public toObject(): Object {
    return {
      discordid: this._discordid,
      firstname: this._firstname,
      lastname: this._lastname,
      job: this._job,
      timestamp: this._timestamp,
    };
  }
}

export { RegisteredUser };
