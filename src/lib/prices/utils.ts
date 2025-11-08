import "server-only";

// Environment variables for user agent
const APP_NAME = process.env.PDT_APP_NAME;
const APP_VERSION = process.env.PDT_APP_VERSION;

// Build repository info from environment variables
const GIT_PROVIDER = process.env.VERCEL_GIT_PROVIDER;
const GIT_OWNER = process.env.VERCEL_GIT_REPO_OWNER;
const GIT_REPO = process.env.VERCEL_GIT_REPO_SLUG;

const REPO_INFO =
  GIT_OWNER && GIT_REPO
    ? `${GIT_PROVIDER}.com/${GIT_OWNER}/${GIT_REPO}`
    : "unknown";

export const USER_AGENT = `${APP_NAME}/${APP_VERSION} (${REPO_INFO})`;
