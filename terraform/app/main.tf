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

resource "aws_s3_bucket" "app_artifacts" {
  bucket = "award-calculator.ellie.aburke.me"
  tags = {
    "Name" = "Award Calculator FE app artifacts"
    "Environment" = "Prod"
    "Project" = "award-calculator"
  }
}

resource "aws_s3_bucket_ownership_controls" "app_artifacts" {
  bucket = aws_s3_bucket.app_artifacts.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "app_artifacts" {
  depends_on = [aws_s3_bucket_ownership_controls.app_artifacts]

  bucket = aws_s3_bucket.app_artifacts.id
  acl    = "private"
}
