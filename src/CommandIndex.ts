import Command from "./Command";
import HelloWorld from "./commands/HelloWorldCommand";
import RegisterCommand from "./commands/RegisterCommand";
import UnregisterCommand from "./commands/UnregisterCommand";
import IdCardCreateCommand from "./commands/IdCardCreateCommand";
import FindIdCardCommand from "./commands/FindIdCardCommand";
import FindDriversLicenseCommand from "./commands/FindDriversLicenseCommand";
import DriversLicenseCommand from "./commands/DriversLicenseCommand";
import LicensePlateCommand from "./commands/LicensePlateCommand";
import LicensePlateRegisterCommand from "./commands/LicensePlateRegisterCommand";

const commands: Command[] = [
  HelloWorld,
  RegisterCommand,
  UnregisterCommand,
  IdCardCreateCommand,
  FindIdCardCommand,
  FindDriversLicenseCommand,
  DriversLicenseCommand,
  LicensePlateCommand,
  LicensePlateRegisterCommand,
];

export default commands;
