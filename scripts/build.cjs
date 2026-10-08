const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'target');
const compilerPackagePath = require.resolve('typescript/package.json');
const compilerPackage = require(compilerPackagePath);
const compiler = path.resolve(path.dirname(compilerPackagePath), compilerPackage.bin.tsc);
const compilerArgs = [compiler, '-p', root];

function stampBuild() {
    const compiledAt = new Date().toISOString();
    const script = `const compiledAt = ${JSON.stringify(compiledAt)};
const compileDate = document.getElementById('compile-date');
if (compileDate) {
    compileDate.dateTime = compiledAt;
    compileDate.textContent = new Date(compiledAt).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
}
`;
    fs.writeFileSync(path.join(output, 'build-info.js'), script);
    console.log(`Compiled ${compiledAt}`);
}

if (process.argv.includes('--watch')) {
    fs.mkdirSync(output, { recursive: true });
    let stampTimer;
    const watcher = fs.watch(output, (event, filename) => {
        if (!filename || !filename.endsWith('.js') || filename === 'build-info.js') return;
        clearTimeout(stampTimer);
        stampTimer = setTimeout(stampBuild, 100);
    });
    const child = spawn(process.execPath, [...compilerArgs, '--watch', '--preserveWatchOutput'], {
        cwd: root,
        stdio: 'inherit'
    });
    child.on('error', error => {
        console.error(error.message);
        watcher.close();
        clearTimeout(stampTimer);
        process.exitCode = 1;
    });
    child.on('exit', code => {
        watcher.close();
        clearTimeout(stampTimer);
        process.exitCode = code ?? 1;
    });
    process.on('SIGINT', () => child.kill('SIGINT'));
    process.on('SIGTERM', () => child.kill('SIGTERM'));
} else {
    const result = spawnSync(process.execPath, compilerArgs, { cwd: root, stdio: 'inherit' });
    if (result.error) console.error(result.error.message);
    if (result.status === 0) stampBuild();
    process.exitCode = result.status ?? 1;
}