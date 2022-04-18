import Command from "./Command";
import HelloWorld from "./commands/HelloWorldCommand";
import RegisterCommand from "./commands/RegisterCommand";
import UnregisterCommand from "./commands/UnregisterCommand";
import IdCardCreateCommand from "./commands/IdCardCreateCommand";
import FindIdCardCommand from "./commands/FindIdCardCommand";

const commands: Command[] = [
  HelloWorld,
  RegisterCommand,
  UnregisterCommand,
  IdCardCreateCommand,
  FindIdCardCommand,
];

export default commands;
