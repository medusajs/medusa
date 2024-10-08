import { Command } from "commander"

import { generateIcons } from "@/commands/icons/command"
import { generateTokens } from "@/commands/tokens/command"

import pkg from "../package.json"

export async function createCli() {
  const program = new Command()

  program.name("toolbox").version(pkg.version)

  // Icon

  const generateIconsCommand = program.command("icons")
  generateIconsCommand.description("Generate icons from Figma")

  generateIconsCommand.option("-o, --output <path>", "Output directory")

  generateIconsCommand.action(generateIcons)

  // Color tokens

  const generateTokensCommand = program.command("tokens")
  generateTokensCommand.description("Generate tokens from Figma")

  generateTokensCommand.option("-o, --output <path>", "Output directory")

  generateTokensCommand.action(generateTokens)

  return program
}
