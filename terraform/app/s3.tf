resource "aws_s3_bucket" "app_artifacts" {
  bucket = "award-calculator.ellie.aburke.me"
  tags = merge({
    "Name" = "Award Calculator FE app artifacts"
  }, local.default_tags)
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

resource "aws_s3_bucket_policy" "s3_cloudfront_access_policy" {
  bucket = aws_s3_bucket.app_artifacts.id
  policy = data.aws_iam_policy_document.s3_cloudfront_access_policy.json
}

data "aws_iam_policy_document" "s3_cloudfront_access_policy" {
  statement {
    effect = "Allow"
    principals {
      type = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]
    resources = [
      "${aws_s3_bucket.app_artifacts.arn}/app/*"
    ]

    condition {
      test = "StringEquals"
      variable = "AWS:SourceArn"
      values = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}
