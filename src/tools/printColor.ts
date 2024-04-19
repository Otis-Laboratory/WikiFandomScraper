enum MessageType {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  SUCCESS = "success",
}

function printColor(message: string, type: MessageType) {
  const colors = {
    reset: "\x1b[0m",
    error: "\x1b[91m", // red
    warn: "\x1b[93m",
    info: "\x1b[94m", // blue
    success: "\x1b[92m",
  };

  const color = colors[type] || colors.reset;
  console.log(color + message + colors.reset);
}

export { MessageType, printColor };
