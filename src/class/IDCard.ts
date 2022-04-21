import { DriversLicense } from "./DriversLicense";

class IDCard {
  public id: string;
  public discordUserId: string;
  public discordGuildId: string;
  public firstname: string;
  public lastname: string;
  public birthday: string;
  public nationality: string;
  public hometown: string;
  public placeOfBirth: string;
  public authority: string;
  public linkToImage: string;
  public createdAt: Date;

  public driversLicense: DriversLicense;

  constructor(
    id: string,
    discordUserId: string,
    discordGuildId: string,
    firstname: string,
    lastname: string,
    birthday: string,
    nationality: string,
    hometown: string,
    placeOfBirth: string,
    authority: string,
    linkToImage: string,
    driversLicense: DriversLicense,
    date?: Date
  ) {
    this.id = id;
    this.discordUserId = discordUserId;
    this.discordGuildId = discordGuildId;
    this.firstname = firstname;
    this.lastname = lastname;
    this.birthday = birthday;
    this.nationality = nationality;
    this.hometown = hometown;
    this.placeOfBirth = placeOfBirth;
    this.authority = authority;
    this.linkToImage = linkToImage;
    this.driversLicense = driversLicense;
    this.createdAt = date ? date : new Date();
  }
}

export { IDCard };
