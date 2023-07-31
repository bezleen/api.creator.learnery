import { GraphQLDefinitionsFactory } from '@nestjs/graphql'
import { join } from 'path'

interface Flags {
  watch?: boolean
  w?: boolean
}

// Function to extract flags from the arguments array
function extractFlags(args) {
  const flags: Flags = {}
  let currentFlag = null

  for (const arg of args) {
    if (arg.startsWith('--')) {
      // Long flag (e.g., --watch)
      const flagName = arg.slice(2)
      flags[flagName] = true
      currentFlag = flagName
    } else if (arg.startsWith('-')) {
      // Short flag (e.g., -w)
      const flagKeys = arg.slice(1).split('')
      flagKeys.forEach((key) => {
        flags[key] = true
      })
      currentFlag = arg.slice(-1)
    } else if (currentFlag) {
      // Flag value (e.g., --name John)
      flags[currentFlag] = arg
      currentFlag = null
    }
  }

  return flags
}

const args = process.argv.slice(2)
const flags: Flags = extractFlags(args)

console.log('Flags:', flags)

const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  outputAs: 'class',
  watch: flags.watch || flags.w,
})
