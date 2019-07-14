import { Host } from "./../../host"
import { IActivity } from "./../../lib/queue/initialize"
import registerActivity from "./registerActivity"

interface IGetActivityInput {
  host: Host
  activity: IActivity
}

const getActivity = async (input: IGetActivityInput): Promise<IActivity> => {
  // TODO: Returns activity from registry. Installs if necessary.
  const handleActivity: IActivity = input.host.registry.hasOwnProperty(
    input.activity.id
  )
    ? input.host.registry[input.activity.id]
    : await registerActivity({
        host: input.host,
        activity: input.activity
      })
  return handleActivity
}

export default getActivity
