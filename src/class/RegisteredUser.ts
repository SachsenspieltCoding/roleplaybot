class OwnerMessage {
  public channelid: string;
  public messageid: string;

  constructor(channelid: string, messageid: string) {
    this.messageid = messageid;
    this.channelid = channelid;
  }
}

class RegisteredUser {
  public readonly id: string;
  public pending: boolean;
  public readonly userid: string;
  public readonly guildid: string;
  public readonly firstname: string;
  public readonly lastname: string;
  public readonly job: string;
  public readonly timestamp: Date;

  public ownerMessages: OwnerMessage[] = [];

  constructor(
    id: string,
    userid: string,
    guildid: string,
    firstname: string,
    lastname: string,
    job: string,
    timestamp?: Date,
    pending?: boolean
  ) {
    this.id = id;
    this.userid = userid;
    this.guildid = guildid;
    this.firstname = firstname;
    this.lastname = lastname;
    this.job = job;
    this.timestamp = timestamp ? timestamp : new Date();
    this.pending = pending ? pending : true;
  }

  public addOwnerMessage(omsg: OwnerMessage): this {
    this.ownerMessages.push(omsg);
    return this;
  }

  public removeOwnerMessage(omsg: OwnerMessage): this {
    this.ownerMessages = this.ownerMessages.filter(
      (m) => m.messageid !== omsg.messageid
    );
    return this;
  }

  public setFinished(): void {
    this.pending = false;
  }
}

export { OwnerMessage, RegisteredUser };
