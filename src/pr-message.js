const {
    exec,
    execSync,
} = require('child_process')
const readline = require('readline-sync')

const main = async function () {
    const branchName = readline.question('🤓 Which branch will you PR into (leave blank to skip)? ')

    if (!branchName) {
        process.exit(0);
    }

    const testCmd = `git show-branch ${branchName}`
    try {
        await execSync(testCmd)
    } catch(e) {
        console.log('🚫 Could not find branch.')

        return main()
    }

    const cmd = `git --no-pager log ${branchName}.. --no-merges --reverse --format=format:\\#START\\-COMMIT\\#\\ %B%n\\#END\\-COMMIT\\#%n`

    exec(cmd, (error, log) => {
        if (error) {
            console.log('Error:', error.message)

            process.exit(1)
        }

        // Better formatting for log
        const commits = log.match(/^#START-COMMIT# (.*)(?:(?!^#START-COMMIT#)[\s\S])*/gm)
        const output = commits.reduce((acc, commit) => {
            const formattedCommit = commit.replace(/^#START-COMMIT# (.*)\n([\s\S]*)\n#END-COMMIT#/gm, '* $1\n$2')
            const lines = formattedCommit.match(/.*/gm)

            for (const i in lines) {
                acc += (lines[i] && `${(i > 0 && '    ') || ''}${lines[i]}\n`) || ''
            }

            return acc
        }, '')

        console.log('\n✅ Here is your PR message:\n')
        console.log(output)
    })
}

module.exports = main
