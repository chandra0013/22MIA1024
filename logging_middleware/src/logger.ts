const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

const allowedStacks = ["backend", "frontend"];

const allowedLevels = ["debug", "info", "warn", "error", "fatal"];

const backendPackages = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
  "middleware",
  "utils",
  "auth",
  "config"
];

const frontendPackages = [
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
  "middleware",
  "utils",
  "auth",
  "config"
];

let accessToken = "";

export function setLoggerToken(token: string) {
  accessToken = token;
}

export async function Log(
  stack: string,
  level: string,
  packageName: string,
  message: string
) {
  if (!allowedStacks.includes(stack)) {
    return {
      success: false,
      message: "Invalid stack value"
    };
  }

  if (!allowedLevels.includes(level)) {
    return {
      success: false,
      message: "Invalid level value"
    };
  }

  const validPackages =
    stack === "backend" ? backendPackages : frontendPackages;

  if (!validPackages.includes(packageName)) {
    return {
      success: false,
      message: "Invalid package value for selected stack"
    };
  }

  if (!message || message.trim().length === 0) {
    return {
      success: false,
      message: "Log message cannot be empty"
    };
  }

  if (!accessToken) {
    return {
      success: false,
      message: "Access token is missing"
    };
  }

  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        data
      };
    }

    return {
      success: true,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to send log"
    };
  }
}