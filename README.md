# Award Calculator

Simple FE tool to perform Australian labour award calculations.

**Location:** https://award-calculator.ellie.aburke.me/

## Development

This is a browser-based app using React + Redux written in Typescript.

### Run locally

From the `award-calculator-fe` directory:

```sh
npm start
```

### Run tests

From the `award-calculator-fe` directory:

```sh
npm test
```

### Build locally

From the `award-calculator-fe` directory:

```sh
npm run build
```

## Infrastructure

Infrastructure is managed using Terraform backed by S3 remote state. Application infrastructure is contained
in the `terraform/app` directory.
