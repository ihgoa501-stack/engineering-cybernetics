const isCodex = Boolean(process.env.PLUGIN_DATA);

function writeContext(event, context) {
  if (isCodex) {
    process.stdout.write(JSON.stringify({
      systemMessage: 'ENGINEERING_CYBERNETICS:ACTIVE',
      hookSpecificOutput: {
        hookEventName: event,
        additionalContext: context,
      },
    }));
    return;
  }

  if (event === 'SubagentStart') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: event,
        additionalContext: context,
      },
    }));
    return;
  }

  process.stdout.write(context);
}

module.exports = { writeContext };
