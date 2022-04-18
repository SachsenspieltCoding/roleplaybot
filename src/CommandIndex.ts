import Command from "./Command";
import HelloWorld from "./commands/HelloWorldCommand";
import RegisterCommand from "./commands/RegisterCommand";
import UnregisterCommand from "./commands/UnregisterCommand";

const commands: Command[] = [HelloWorld, RegisterCommand, UnregisterCommand];

export default commands;
