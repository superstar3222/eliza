/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import yargs from "yargs";
import { DiscordClient } from "./clients/discord/index.ts";
import { TwitterGenerationClient } from "./clients/twitter/generate.ts";
import { TwitterSearchClient } from "./clients/twitter/search.ts";
import { TwitterInteractionClient } from "./clients/twitter/interactions.ts";
import Database from "better-sqlite3";
import askClaude from "./actions/ask_claude.ts";
import elaborate from "./actions/elaborate.ts";
import follow_room from "./actions/follow_room.ts";
import joinvoice from "./actions/joinvoice.ts";
import leavevoice from "./actions/leavevoice.ts";
import mute_room from "./actions/mute_room.ts";
import unfollow_room from "./actions/unfollow_room.ts";
import unmute_room from "./actions/unmute_room.ts";
import { SqliteDatabaseAdapter } from "./adapters/sqlite.ts";
import { AgentRuntime } from "./core/runtime.ts";
import settings from "./core/settings.ts";
import channelStateProvider from "./clients/discord/providers/channelState.ts";
import timeProvider from "./providers/time.ts";
import voiceStateProvider from "./clients/discord/providers/voiceState.ts";
import { defaultActions } from "./core/actions.ts";

interface Arguments {
  character?: string;
  twitter?: boolean;
  discord?: boolean;
}

let argv: Arguments = {
  character: "./src/agent/default_character.json",
  twitter: false,
  discord: false,
};

try {
  // Parse command line arguments
  argv = yargs(process.argv)
    .option("character", {
      type: "string",
      description: "Path to the character JSON file",
    })
    .option("twitter", {
      type: "boolean",
      description: "Start only the Twitter client",
    })
    .option("discord", {
      type: "boolean",
      description: "Start only the Discord client",
    })
    .parseSync() as Arguments;
} catch (error) {
  console.log("Error parsing arguments:");
  console.log(error);
}

// Load character
const characterPath = argv.character;
let character = null;
try {
  character = JSON.parse(fs.readFileSync(characterPath, "utf8"));
} catch (e) {
  console.error("Unable to parse character. Using default");
}

const runtime = new AgentRuntime({
  databaseAdapter: new SqliteDatabaseAdapter(new Database("./db.sqlite")),
  token: settings.OPENAI_API_KEY as string,
  serverUrl: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
  evaluators: [],
  character,
  providers: [channelStateProvider, voiceStateProvider, timeProvider],
  actions: [
    ...defaultActions,
    joinvoice,
    leavevoice,
    askClaude,
    mute_room,
    unmute_room,
    follow_room,
    unfollow_room,
  ],
});

function startDiscord() {
  const discordClient = new DiscordClient(runtime);
}

async function startTwitter() {
  // console.log("Starting interaction client")
  // const twitterInteractionClient = new TwitterInteractionClient(runtime);
  // // wait 2 seconds
  // await new Promise(resolve => setTimeout(resolve, 2000));
  // console.log("Starting search client");
  // const twitterSearchClient = new TwitterSearchClient(runtime);
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Starting generation client");
  const twitterGenerationClient = new TwitterGenerationClient(runtime);
}

if (argv.discord || (!argv.twitter && !argv.discord)) {
  startDiscord();
}
if (argv.twitter || (!argv.twitter && !argv.discord)) {
  startTwitter();
}
