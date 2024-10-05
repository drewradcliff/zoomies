import path from "node:path";

/** @satisfies {import("lint-staged").Config} */
const config = {
  "*": "prettier --cache --ignore-unknown --write",
  "*.{js,jsx,ts,tsx}": (filenames) =>
    `next lint --fix ${filenames
      .map((filename) => `--file ${path.relative(process.cwd(), filename)}`)
      .join(" ")}`,
};

export default config;
