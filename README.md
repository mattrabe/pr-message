# pr-message

![npm version](https://img.shields.io/npm/v/pr-message) ![npm bundle size](https://img.shields.io/bundlephobia/min/pr-message) ![npm downloads](https://img.shields.io/npm/dt/pr-message) ![NPM License](https://img.shields.io/npm/l/pr-message)

Automatically generate beautiful PR messages.

## Installation:

```
yarn add --dev pr-message
```

or

```
npm add --save-dev pr-message
```

To automatically run after every commit, add this package to your `post-commit` hook:

```
"husky": {
    "hooks": {
        "post-commit": "pr-message"
    }
}
```

## On-demand use:

Run `pr-message` and enter a target branch when prompted:

```
$ yarn pr-message

pr-message v1
🤓 Which branch will you PR into (leave blank to skip)? develop

✅ Here is your PR message:

* First commit
* Second commit
    - with multiple
    - lines in message
```
