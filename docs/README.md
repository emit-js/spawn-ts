# @emit-js/spawn

emit process spawn

![spawnTs](media/spawn.gif)

## Install

```bash
npm install @emit-js/emit @emit-js/spawn
```

## Setup

```js
import { Emit } from "@emit-js/emit"
import { spawn } from "@emit-js/spawn"

const emit = new Emit()
spawn(emit)
```

## Usage

```js
await emit.spawn("test", {
  args: ["hi"],
  command: "echo",
})
```

## Index

### External modules

- ["spawn"](modules/_spawn_.md)
- ["spawnTerminal"](modules/_spawnterminal_.md)

---
