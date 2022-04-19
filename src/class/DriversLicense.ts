class DriversLicense {
  public B: boolean;
  public C: boolean;
  public A1: boolean;
  public AM: boolean;
  public T: boolean;
  public L: boolean;

  constructor(
    B: boolean,
    C: boolean,
    A1: boolean,
    AM: boolean,
    T: boolean,
    L: boolean
  ) {
    this.B = B;
    this.C = C;
    this.A1 = A1;
    this.AM = AM;
    this.T = T;
    this.L = L;
  }

  public setDriverclass(type: DriversLicenseTypes, value: boolean) {
    switch (type) {
      case DriversLicenseTypes.B:
        this.B = value;
        break;
      case DriversLicenseTypes.C:
        this.C = value;
        break;
      case DriversLicenseTypes.A1:
        this.A1 = value;
        break;
      case DriversLicenseTypes.AM:
        this.AM = value;
        break;
      case DriversLicenseTypes.T:
        this.T = value;
        break;
      case DriversLicenseTypes.L:
        this.L = value;
        break;
    }
  }
}

enum DriversLicenseTypes {
  B,
  C,
  A1,
  AM,
  T,
  L,
}

export { DriversLicense, DriversLicenseTypes };
