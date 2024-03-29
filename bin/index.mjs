// Importing dependencies
import fs from "fs-extra"
import path from "path"

import inquirer from "inquirer"

// Function to prompt user for confirmation
async function promptForConfirmation() {
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmUpdate",
      message: "Do you want to update/create the Tailwind configuration file?",
      default: false,
    },
  ])
  return answers.confirmUpdate
}

const templateContent = `
import plugin from "tailwindcss/plugin"

const config = {
    extend: {
        fontSize: {
            sm: [
              "0.688rem",
              {
                lineHeight: "12px",
              },
            ],
            base: [
              "1rem",
              {
                lineHeight: "20px",
              },
            ],
            md: [
              "1.438rem", // 23px
              {
                lineHeight: "28px",
              },
            ],
            lg: [
              "2rem", //32px
              {
                lineHeight: "32px",
              },
            ],
            xl: [
              "2.813rem",
              {
                lineHeight: "40px",
              },
            ],
            "2xl": [
              "4rem",
              {
                lineHeight: "64px",
              },
            ],
            "3xl": [
              "5.625rem",
              {
                lineHeight: "80px",
              },
            ],
          },
          fontWeight: {
            normal: "400",
            medium: "500",
            semibold: "600",
            bold: "700",
            black: "800",
          },
          spacing: {
            "1": "0.5rem",
            "2": "1rem",
            "3": "1.5rem",
            "4": "2rem",
            "5": "2.5rem",
            "6": "3rem",
            "7": "3.5rem",
            "8": "4rem",
            "9": "4.5rem",
            "10": "5rem",
            "11": "5.5rem",
            "12": "6rem",
            "14": "7rem",
            "16": "8rem",
            "18": "9rem",
            "20": "10rem",
            "22": "11rem",
            "24": "12rem",
            "26": "13rem",
            "28": "14rem",
            "30": "15rem",
            "32": "16rem",
            "34": "17rem",
            "36": "18rem",
            "38": "19rem",
            "40": "20rem",
          }
        },
        plugins: [
            plugin(function ({ addComponents }) {
              addComponents({
                ".font-body-small": {
                  "@apply text-sm": {},
                },
                ".font-body-base": {
                  "@apply text-base": {},
                },
                ".font-body-large": {
                  "@apply text-md": {},
                },
                ".font-heading-tiny": {
                  "@apply text-sm uppercase": {},
                },
        
                ".font-heading-small": {
                  "@apply font-semibold text-md tracking-tight": {},
                  lineHeight: "28px",
                },
                ".font-heading-medium": {
                  "@apply font-semibold text-xl tracking-tight": {},
                },
                ".font-heading-large": {
                  "@apply font-bold text-2xl tracking-tight": {},
                },
        
                ".font-display-small": {
                  "@apply font-black text-xl uppercase": {},
                  //  lineHeight: "72px",
                },
                ".font-display-medium": {
                  "@apply text-2xl uppercase": {},
                  //lineHeight: "100px",
                },
                ".font-display-large": {
                  "@apply font-black text-3xl uppercase": {},
                  //lineHeight: "140px",
                },
                ".font-display-vw": {
                  "@apply font-black uppercase": {},
                  fontSize: "max(calc(100vw / 15), 3.5rem)",
                  lineHeight: "0.9",
                },
              })
            }),
            require("tailwindcss-animate"),
          ]
        }
`

// Main function to check for the Tailwind configuration file and update it
export async function checkAndCreateOrUpdateTailwindFile() {
  const currentDirectory = process.cwd()
  const fileNames = [
    "tailwind.config.mjs",
    "tailwind.config.js",
    "tailwind.config.ts",
  ]
  let existingFileName

  // Check for existing files
  for (let fileName of fileNames) {
    if (await fs.pathExists(path.join(currentDirectory, fileName))) {
      existingFileName = fileName
      break
    }
  }

  // Prompt the user for confirmation
  const confirmUpdate = await promptForConfirmation()

  if (!confirmUpdate) {
    console.log("Operation cancelled.")
    return
  }

  // Determine the file name to create or update
  const targetFileName = existingFileName || "tailwind.js"
  const targetFilePath = path.join(currentDirectory, targetFileName)

  // Process template content if needed
  let contentToWrite =
    typeof templateContent === "function" ? templateContent() : templateContent

  // Write or update the file
  await fs.writeFile(targetFilePath, contentToWrite)
  console.log(
    `${
      existingFileName ? "Updated" : "Created"
    } ${targetFileName} successfully.`
  )
}

checkAndCreateOrUpdateTailwindFile().catch(console.error)
