# AutoTracker

An endless randomised algorithmic Chiptune composition by [Vitling](https://www.vitling.xyz) aka [Demoscene Time Machine](http://demoscenetimemachine.com)

Live version exists [online here](https://www.vitling.xyz/toys/autotracker/)

## Building

Run `npm install`, then `npm run build` to compile the TypeScript and update the compile date displayed beside the Original Source Code link. The timestamp is stored in UTC and displayed in the browser's local timezone. `build.sh` runs the same build.

Run `npm run watch` for automatic recompilation and compile-date updates while editing. Use these commands instead of invoking `tsc` directly or relying on editor compile-on-save, which bypass the timestamp hook.

When deploying, include `index.html` and the files in `target/`, including the generated `build-info.js`.

This work is licensed under a [Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/)
