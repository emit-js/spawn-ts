import { Emit, EventType } from "@emit-js/emit"
import { spawnTerminal } from "./spawnTerminal"

export interface SpawnArg {
  args?: string[]
  command: string
  cwd?: string
  exit?: boolean
  json?: boolean
  quiet?: boolean
  save?: boolean
}

export interface SpawnReturn {
  code: number
  err: boolean
  out: string
  signal: number
}

export class Spawn {
  public async listener(
    e: EventType,
    arg: SpawnArg
  ): Promise<SpawnReturn> {
    const { emit } = e
    const { args, cwd, exit, json, quiet, save } = arg

    let { code, out, signal } = await e.emit.spawnTerminal(
      e.id, arg
    )

    const err = code > 0

    if (!err && json) {
      out = JSON.parse(out)
    }

    if (!quiet) {
      const level = err ? "warn" : "info"
      const messages = [
        `command: ${arg.command}${
          args ? " " + args.join(" ") : ""
        }`,
        `cwd: ${cwd || process.cwd()}`,
        `code: ${code}`,
        `output:\n${out}`,
      ]

      for (const message of messages) {
        emit.emit(["log", "spawn", e.id], level, message)
      }
    }

    if (err) {
      e.cancel = true

      if (exit) {
        process.exit(code)
      }
    }

    const output = { code, err, out, signal }

    if (save) {
      await emit.emit(["set", e.id], output)
    }

    return output
  }
}

declare module "@emit-js/emit" {
  interface Emit {
    spawn(
      id: EventIdType,
      arg: SpawnArg
    ): Promise<SpawnReturn>
  }
}

export function spawn(emit: Emit): void {
  spawnTerminal(emit)
  
  const spawn = new Spawn()
  emit.any("spawn", spawn.listener.bind(spawn))
}

export const listen = spawn
