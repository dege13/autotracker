const compiledAt = "2026-10-08T20:29:01.313Z";
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
