class RegisteredUser {
  public readonly id: string;
  public readonly userid: string;
  public readonly guildid: string;
  public readonly firstname: string;
  public readonly lastname: string;
  public readonly job: string;
  public readonly timestamp: Date;

  public ownerMessagesIds: string[] = [];

  constructor(
    id: string,
    userid: string,
    guildid: string,
    firstname: string,
    lastname: string,
    job: string,
    timestamp?: Date
  ) {
    this.id = id;
    this.userid = userid;
    this.guildid = guildid;
    this.firstname = firstname;
    this.lastname = lastname;
    this.job = job;
    this.timestamp = timestamp ? timestamp : new Date();
  }

  public addOwnerMessage(id: string): this {
    this.ownerMessagesIds.push(id);
    return this;
  }

  public removeOwnerMessage(id: string): this {
    this.ownerMessagesIds = this.ownerMessagesIds.filter((m) => m !== id);
    return this;
  }
}

export { RegisteredUser };
