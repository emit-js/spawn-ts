import { Emit, EventType } from "@emit-js/emit"
import { spawn } from "node-pty"

export interface SpawnTerminalArg {
  args?: string[]
  command: string
  cwd?: string
  env?: Record<string, string>
}

export interface SpawnTerminalReturn {
  code: number
  out: string
  signal: number
}

export class SpawnTerminal {
  public async spawnTerminal(
    e: EventType,
    arg: SpawnTerminalArg
  ): Promise<SpawnTerminalReturn> {
    const cols = process.stdout.columns
    const rows = process.stdout.rows

    const { args = [], command, cwd, env } = arg

    const pty = spawn(command, args, {
      cols,
      cwd,
      env,
      name: "xterm-color",
      rows,
    })

    let out = ""

    pty.on("data", (data): void => {
      out += data
    })

    return new Promise((resolve): void => {
      pty.on("exit", (code, signal): void =>
        resolve({ code, out, signal })
      )
    })
  }
}

declare module "@emit-js/emit" {
  interface Emit {
    spawnTerminal(
      id: EventIdType,
      arg: SpawnTerminalArg
    ): Promise<SpawnTerminalReturn>
  }
}

export function spawnTerminal(emit: Emit): void {
  const spawnTerminal = new SpawnTerminal()
  emit.any(
    "spawnTerminal",
    spawnTerminal.spawnTerminal.bind(spawnTerminal)
  )
}

export const listen = spawnTerminal
