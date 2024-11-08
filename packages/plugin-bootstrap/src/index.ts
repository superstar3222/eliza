import { Plugin } from "@ai16z/eliza/src/types.ts";
import { continueAction } from "./actions/continue.ts";
import { followRoomAction } from "./actions/followRoom.ts";
import { unfollowRoomAction } from "./actions/unfollowRoom.ts";
import { ignoreAction } from "./actions/ignore.ts";
import { noneAction } from "./actions/none.ts";
import { muteRoomAction } from "./actions/muteRoom.ts";
import { unmuteRoomAction } from "./actions/unmuteRoom.ts";
import { factEvaluator } from "./evaluators/fact.ts";
import { goalEvaluator } from "./evaluators/goal.ts";
import { boredomProvider } from "./providers/boredom.ts";
import { timeProvider } from "./providers/time.ts";
import { factsProvider } from "./providers/facts.ts";

export const defaultPlugin: Plugin = {
    name: "default",
    description: "Default plugin, with basic actions and evaluators",
    actions: [
        continueAction,
        followRoomAction,
        unfollowRoomAction,
        ignoreAction,
        noneAction,
        muteRoomAction,
        unmuteRoomAction,
    ],
    evaluators: [
        factEvaluator,
        goalEvaluator,
    ],
    providers: [
        boredomProvider,
        timeProvider,
        factsProvider,
    ],
};
