# Award Calculator

[![Build and Deploy](https://github.com/Samour/award-calculator/actions/workflows/build-and-deploy.yaml/badge.svg)](https://github.com/Samour/award-calculator/actions/workflows/build-and-deploy.yaml)

Simple FE tool to perform Australian labour award calculations.

**App location:** https://award-calculator.ellie.aburke.me/

[Requirements](./REQUIREMENTS.md)

[Solution Design](./SOLUTION%20DESIGN.md)

[Backlog](./BACKLOG.md)

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

`terraform/build` defines an IAM user that can be used by the Github Actions pipeline.
