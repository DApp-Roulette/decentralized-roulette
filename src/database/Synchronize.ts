import { $log } from "@tsed/common";

import { Users } from "./Users";

import { Messages } from "./Messages";


export default async function synchronizeDB() {
  try {

    await Users.sync({ alter: true });

    await Messages.sync({ alter: true });

    $log.info("Done synchronize DB")
  } catch (error) {
    $log.error(error.message)
  }

}