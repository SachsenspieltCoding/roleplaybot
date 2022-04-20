class ServerInfoContainer {
  private location: string = "null";
  private servername: string = "null";
  private password: string = "null";
  private language: string = "null";
  private map: string = "null";

  public getLocation(): string {
    return this.location;
  }

  public getServername(): string {
    return this.servername;
  }

  public getPassword(): string {
    return this.password;
  }

  public getLanguage(): string {
    return this.language;
  }

  public getMap(): string {
    return this.map;
  }

  public setLocation(location: string | null): void {
    if (!location) return;
    this.location = location;
  }

  public setServername(servername: string | null): void {
    if (!servername) return;
    this.servername = servername;
  }

  public setPassword(password: string | null): void {
    if (!password) return;
    this.password = password;
  }

  public setLanguage(language: string | null): void {
    if (!language) return;
    this.language = language;
  }

  public setMap(map: string | null): void {
    if (!map) return;
    this.map = map;
  }
}

export { ServerInfoContainer };
