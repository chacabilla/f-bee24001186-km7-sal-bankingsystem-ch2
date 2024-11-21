// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import { init, debugIntegration, profiler, startSpan } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(), debugIntegration()
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
profiler.startProfiler();

// Starts a transaction that will also be profiled
startSpan({
  name: "Banking System - Salsa",
}, () => {
  // the code executing inside the transaction will be wrapped in a span and profiled
});

// Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// your application until the process exits or stopProfiling is called.
profiler.stopProfiler();

module.exports = {
  init,
  debugIntegration,
  profiler,
  startSpan
};