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
