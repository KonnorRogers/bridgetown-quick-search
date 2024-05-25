import * as path from "path";
import chalk from "chalk"
import glob from "glob"
import esbuild from "esbuild"
import { readFileSync } from "fs";

const deps = Object.keys(JSON.parse(readFileSync("./package.json")).dependencies)

const watchMode = process.argv.includes("--watch")

/**
 * @returns {import("esbuild").Plugin}
 */
function BuildTimer () {
  return {
    name: "build-timer",
    setup(build) {
      let startTime

      build.onStart(() => {
        startTime = Number(new Date())
      })

      build.onEnd(() => {
        const endTime = Number(new Date())
        const buildTime = endTime - startTime

        console.log(chalk.green(`Build complete in ${buildTime}ms!`), `✨\n\n`)
      })
    }
  }
}

;(async function () {
  let entries = glob
    .sync("frontend/javascript/**/*.js")
    .map((file) => {
      return "." + path.sep + path.join(path.dirname(file), path.basename(file, path.extname(file)))
    });

  const defaultConfig = {
    entryPoints: ["./frontend/javascript/index.js"],
    sourcemap: true,
    platform: "browser",
    format: "esm",
    target: "es2018",
    color: true,
    bundle: true,
    external: []
  }

  const configs = [
    {
      ...defaultConfig,
      outfile: "frontend/dist/bundle/index.js",
      format: "esm",
      minify: true,
    },
    {
      ...defaultConfig,
      entryPoints: entries,
      outdir: 'frontend/dist',
      format: 'esm',
      target: "es2020",
      splitting: true,
      external: deps,
      chunkNames: 'chunks/[name]-[hash]',
      plugins: [
      	BuildTimer()
      ]
    }
  ]

  if (!watchMode) {
    await Promise.all(configs.map((config) => esbuild.build(config)))
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })

    return
  }

  await Promise.all(configs.map(async (config) => {
    const context = await esbuild.context(config)
    return await context.watch()
  })).catch((err) => {
    console.error(err)
  })
})()
