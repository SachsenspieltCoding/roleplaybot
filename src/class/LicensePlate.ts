class LicensePlate {
  public city: string;
  public letters: string;
  public numbers: string;

  public registeredAt: Date;
  public authority: string;

  public vehicle: string;
  public vehicleClass: string;
  public vehicleHorsepower: number;
  public ownerFirstname: string;
  public ownerLastname: string;

  constructor(
    city: string,
    letters: string,
    numbers: string,
    vehicle: string,
    vehicleClass: string,
    vehicleHorsepower: number,
    ownerFirstname: string,
    ownerLastname: string,
    authority: string,
    registeredAt?: Date
  ) {
    this.city = city;
    this.letters = letters;
    this.numbers = numbers;
    this.vehicle = vehicle;
    this.vehicleClass = vehicleClass;
    this.vehicleHorsepower = vehicleHorsepower;
    this.ownerFirstname = ownerFirstname;
    this.ownerLastname = ownerLastname;
    this.authority = authority;
    this.registeredAt = registeredAt ? registeredAt : new Date();
  }

  public getLicensePlateString(): string {
    return `${this.city} ${this.letters} ${this.numbers}`;
  }
}

export { LicensePlate };
