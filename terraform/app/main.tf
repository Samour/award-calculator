terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  backend "s3" {
    bucket = "build.aburke.me"
    key    = "terraform/me/aburke/elli/awardcalculator.tfstate"
    region = "ap-southeast-2"
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "ap-southeast-2"
}
