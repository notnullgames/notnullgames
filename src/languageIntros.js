// The one hand-written thing on a language page. Everything else - the build
// command, the notes, the signatures - comes from the engine's api.json.
//
// Keep these short and honest: what the language feels like, and who should
// reach for it.

export default {
  c: {
    emoji: '⚡',
    blurb: 'C is the most direct way to write a null0 cart - the API was designed as a C header, and every other language is a wrapper around it. Small carts, no runtime, no surprises.'
  },
  rust: {
    emoji: '🦀',
    blurb: 'Rust carts are no_std and compile straight to wasm. You get the type system and cargo; you give up the standard library, and every null0 call sits in an unsafe block.'
  },
  zig: {
    emoji: '⚡',
    blurb: 'Zig talks to null0 with no glue at all - its extern declarations are the wasm imports. Manual memory, comptime, and a very small cart.'
  },
  go: {
    emoji: '🐹',
    blurb: 'Go carts are built with tinygo, and the API is CamelCase to match the language. You get goroutines, slices and maps in a cart under a megabyte.'
  },
  nim: {
    emoji: '👑',
    blurb: 'Nim reads a bit like Python and compiles through C, so it is fast and small. A good middle ground if C feels too bare.'
  },
  nelua: {
    emoji: '🌚',
    blurb: 'Nelua is a typed Lua that compiles to C. If you already think in Lua but want a compiled cart with no interpreter inside it, this is the one.'
  },
  as: {
    emoji: '🅰️',
    blurb: 'AssemblyScript is TypeScript with wasm types. Nearly the same syntax as a JavaScript cart, but it compiles to a real wasm module instead of shipping an interpreter.'
  },
  odin: {
    emoji: '🦉',
    blurb: 'Odin is a modern take on C, aimed squarely at games. Explicit, data-oriented, and pleasant to read.'
  },
  c3: {
    emoji: '🌱',
    blurb: 'C3 is C with the rough edges filed off - modules, slices, and defer, while staying close enough that the null0 header maps over almost unchanged.'
  },
  d: {
    emoji: '🇩',
    blurb: 'D carts are built with ldc in -betterC mode: no druntime, no GC, but you keep templates, slices and D’s much nicer syntax.'
  },
  onyx: {
    emoji: '💠',
    blurb: 'Onyx is a small language built for WebAssembly from the start, so a cart is about as simple as it gets.'
  },
  grain: {
    emoji: '🌾',
    blurb: 'Grain is a functional language that targets wasm directly. It is the most unusual cart to write - numbers cross the boundary as raw wasm values - but a good one if you like ML-family languages.'
  },
  haxe: {
    emoji: '🧡',
    blurb: 'Haxe reaches null0 through its HL/C target. Callbacks are closures you assign rather than exports, and there is no try/catch, but you get a mature, batteries-included language.'
  },
  haskell: {
    emoji: 'λ',
    blurb: 'Haskell carts are built with wasm32-wasi-ghc in reactor mode. Everything is in IO, and it genuinely works - probably the most surprising thing running on null0.'
  },
  zenc: {
    emoji: '🧘',
    blurb: 'Zen-C transpiles to C and builds with wasi-sdk. It is young, and a few functions have plainer signatures than elsewhere to work around a compiler bug, but simple carts are fine.'
  },
  jik: {
    emoji: '🧩',
    blurb: 'Jik also transpiles to C. Its types do not line up with the null0 ABI, so the bindings are a set of extern declarations and C wrappers you copy into your cart.'
  },
  wat: {
    emoji: '🔧',
    blurb: 'WebAssembly text format: no language at all, just wasm. Nothing is hidden - a Color is four bytes you write into memory yourself. Worth reading once to see what every other cart compiles down to.'
  },
  walt: {
    emoji: '🥤',
    blurb: 'Walt is JavaScript-shaped syntax over raw wasm. Like WAT, you manage memory by hand, but the code is far easier to look at.'
  },
  js: {
    emoji: '😃',
    blurb: 'JavaScript is the quickest way to try an idea. Your cart ships a QuickJS interpreter inside it, so it is a bigger file than a compiled cart - you are trading size for not having to install anything.'
  },
  python: {
    emoji: '🐍',
    blurb: 'Python carts run on RustPython baked into the cart. This is a small Python - no standard library - but the language you know, with the null0 API sitting in globals.'
  },
  lua: {
    emoji: '🌙',
    blurb: 'Lua is the classic game-scripting language, and null0 uses GopherLua so it works inside the host’s interpreter. Plain globals, tables for structs, require for extra files.'
  },
  wren: {
    emoji: '🐦',
    blurb: 'Wren is a small, class-based scripting language with a lovely syntax. The null0 API hangs off a Null0 class, and zero-argument calls are getters.'
  },
  cyber: {
    emoji: '⚡',
    blurb: 'Cyber is a fast, small scripting language. The VM is re-entered for each callback, so your top-level state persists between frames.'
  }
}
