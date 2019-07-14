# Gesso

## Concepts

### System

A collection of one or more hosts.

### Host

Daemon running on a host machine or host virtual machine.

### Activity

A function available for execution.

### Channel

A common abstraction for communication channels across protocols. This is a
building block for "interactive self-assembly".

### Stream

Communication channel available for reading objects from and writing objects to
a channel.

## Usage

### `gesso initialize`

Create `~/.gesso`.

### `gesso create [<activity> | <channel>]`

Create a new activity directory in `~/.gesso/activity`. The new activity will be
uniquely identified with the UUID used to name it with a unique identifier
(e.g., `~/.gesso/activity/53ce2372-f6ef-4037-84cb-15bbec5ada5b`).

### `gesso list`

Lists the activities in `~/.gesso/activity/`.

### `gesso start [<activity>]`

Starts a specified activity.

### `gesso install <activity>`

Downloads the specified activity from the list of repositories configured in
`~/.gesso/config.json`.

### `gesso uninstall <activity>`

Deletes the specified activity from the `~/.gesso/activity/` folder.

### `gesso tag [<activity>, ..., <activity>]`

Tags the specified activities for this host. Preset tags in an activity's
`~/.gesso/config.json` file are made available by default (if installed).

### `gesso enable <activity>`

Makes the specified activity available on the host. Installs if not already
instealled.

#### Examples

- `gesso enable 15be604a-ce3d-4ba0-a15e-d8c22848502d3`
- `gesso enable @mgub/my-activity`
- `gesso enable tag:one-or-multiple-tagged-activities`

### `gesso disable <activity>`

Disables the specified activities on the host. The activity will remain
installed in `~/.gesso/activity/[<activity>]` unless uninstalled with
`gesso uninstall <activity>`.

### `gesso connect`

To better understand how to use this command, see the following examples:

- `gesso connect a1:a2`

## Deployment (Kubernetes)

Gesso creates a Kubernetes deployment configuration for systems in
`~/.gesso/system`. Each activity-version combination runs on its own pod and is
available to other activities that depend on that activity-version.

To start a system, run `gesso start <system>`.

## Gesso Producer-Consumer Model

### RabbitMQ Messaging Model

Gesso leverages RabbitMQ for in-cluster messaging. Key concepts from the
RabbitMQ messaging model are below, taken from the
[RabbitMQ documentation](https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html):

- A **producer** is a user application that sends messages.
- A **queue** is a buffer that stores messages.
- A **consumer** is a user application that receives messages.

> The core idea in the messaging model in RabbitMQ is that the producer never
> sends any messages directly to a queue. Actually, quite often the producer
> doesn't even know if a message will be delivered to any queue at all.

> Instead, the producer can only send messages to an exchange. An exchange is a
> very simple thing. On one side it receives messages from producers and the
> other side it pushes them to queues. The exchange must know exactly what to do
> with a message it receives. Should it be appended to a particular queue?
> Should it be appended to many queues? Or should it get discarded. The rules
> for that are defined by the exchange type.

The exchanges in the current Gesso implementation are `fanout` exchanges:

> The fanout exchange is very simple. As you can probably guess from the name,
> it just broadcasts all the messages it receives to all the queues it knows.
> And that's exactly what we need for our logger.

## Docker container

### Filesystem

```
/home/gesso/.gesso            # Gesso configuration.
/home/gesso/.gesso/config     # Gesso configuration.
/home/gesso/gesso-host        # Gesso host.
```

Each Gesso host will checkout activity scripts as needed, essentially
provisioning an additional activity host. Each Gesso host can be started with a
list activites that should be made available or can host one and only one
activity.

**TODO:** Define and describe usage of the RabbitMQ message that all non-singleton hosts will listen to enable another activity.

When a Gesso host receives an `ENABLE_ACIVITY` message on queue `GESSO_HOST`
to enable activity `ACTIVITY_ID`, the activity `ACTIVITY_ID` will be enabled
with the following process:

1. The Gesso host clones the activity _gesso/activity/<ACTIVITY_ID>_ into
   `/home/gesso/.gesso/activity/<ACTIVITY_ID>` as needed.

2. The Gesso host transpiles the activity with the command:

   ```
   cd /home/gesso/.gesso/activity/<ACTIVITY_ID>
   npx tsc
   # The activity is transpiled to ~/.gesso/activity/<ACTIVITY_ID>/dist as a
   #   Node module.
   ```

3. Upon successfully importing the Node module representing the activity, the
   Gesso host subscribes to the RabbitMQ channel (or channel specified by the
   activity's input, so it can consume and respond to messages targeting it).

### References

- [Docker Documentation - `docker create`](https://docs.docker.com/engine/reference/commandline/create/)