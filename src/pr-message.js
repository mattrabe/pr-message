const {
    exec,
    execSync,
} = require('child_process')
const readline = require('readline-sync')

const { crossEnv: crossEnvString } = require('./strings')

const main = async function () {
    console.info('')
    const targetBranch = readline.question(crossEnvString('🤓 Which branch will your PR target (leave blank to skip)? '))
    console.info('')

    if (!targetBranch) {
        process.exit(0);
    }

    let currentBranch
    try {
        currentBranch = await execSync('git branch --show-current').toString().trim()
    } catch(e) {}

    if (!currentBranch) {
        console.error(crossEnvString('🚫 Could not get current branch.'))

        process.exit(1)
    }
    else if (currentBranch === targetBranch) {
        console.error(crossEnvString('🚫 Target branch must be different than current branch.'))

        return main()
    }

    try {
        const syncCmds = {
            [`Checking out ${targetBranch}`]: `git checkout ${targetBranch}`,
            [`Pulling latest from ${targetBranch}`]: 'git pull',
            [`Checking back out ${currentBranch}`]: `git checkout ${currentBranch}`,
            [`Pulling latest from ${currentBranch}`]: 'git pull',
        }

        for (const label in syncCmds) {
            console.info(crossEnvString(`⏳ ${label}...`))

            await execSync(syncCmds[label])
        }
    } catch(e) {
        console.error(crossEnvString('🚫 Could not sync target branch.'))

        return main()
    }

    const logCmd = `git --no-pager log ${targetBranch}.. --no-merges --reverse --format=format:#START-COMMIT#%B%n#END-COMMIT#%n`

    exec(logCmd, (error, log) => {
        if (error) {
            console.error(crossEnvString(error.message))

            process.exit(1)
        }

        const commits = log.match(/^#START-COMMIT#(.*)(?:(?!^#START-COMMIT#)[\s\S])*/gm)
        const output = commits?.reduce((acc, commit) => {
            const formattedCommit = commit.replace(/^#START-COMMIT#(.*)\n([\s\S]*)\n#END-COMMIT#/gm, '* $1\n$2')
            const lines = formattedCommit.match(/.*/gm)

            for (const i in lines) {
                acc += (lines[i] && `${(i > 0 && '    ') || ''}${lines[i]}\n`) || ''
            }

            return acc
        }, '')

        if (!output) {
            console.info(crossEnvString('\n✅ No commits, no message!'))

            process.exit(0)
        }

        console.info(crossEnvString('\n✅ Here is your PR message:\n'))
        console.info(output)
    })
}

module.exports = main
