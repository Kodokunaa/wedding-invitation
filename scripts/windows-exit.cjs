// Vinext exits immediately after prerendering. Allow pending native cleanup
// callbacks to drain on Windows before terminating; preserve the exit status.
if (process.platform === 'win32') {
  const exit = process.exit.bind(process);
  process.exit = (code) => { setTimeout(() => exit(code), 500); };
}
