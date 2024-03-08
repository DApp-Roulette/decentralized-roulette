import { $log } from "@tsed/common";

import { Messages } from "./Messages";

export default async function synchronizeDB() {
  try {
    
    await Messages.sync({ alter: true });

    $log.info("Done synchronize DB")
  } catch (error) {
    $log.error(error.message)
  }

}