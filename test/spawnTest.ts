import { Emit } from "@emit-js/emit"
import { log } from "@emit-js/log"
import { store } from "@emit-js/store"
import { spawn } from "../"

let emit: Emit

beforeEach((): void => {
  emit = new Emit()
  log(emit)
  spawn(emit)
  store(emit)
})

test("spawn command", async (): Promise<void> => {
  await emit.spawn("test", {
    args: ["hi"],
    command: "echo",
    save: true,
  })

  expect(emit.get("test")).toMatchObject({
    code: 0,
    err: false,
    out: "hi\r\n",
    signal: 0,
  })
})

test("spawn command with options", async (): Promise<void> => {
  await emit.spawn("test", {
    command: "pwd",
    save: true,
  })

  expect(emit.get("test")).toMatchObject({
    code: 0,
    err: false,
    out: `${process.cwd()}\r\n`,
    signal: 0,
  })
})
