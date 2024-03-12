import { $log } from "@tsed/common";

import { Users } from "./Users";
import { Messages } from "./Messages";
import { MessageToSigns } from "./MessageToSigns";
import { Games } from "./Games";

export default async function synchronizeDB() {
  try {

    await Users.sync({ alter: true });

    await Messages.sync({ alter: true });

    await MessageToSigns.sync({ alter: true });
    
    await Games.sync({ alter: true });

    $log.info("Done synchronize DB");
  } catch (error) {
    $log.error(error.message)
  }

}