resource "aws_iam_user" "ci_user" {
  name = "award-calculator-ci"

  tags = {
    Name = "User for award-calculator CI/CD pipeline"
  }
}

data "aws_iam_policy_document" "ci_policy" {
  // TF state bucket
  statement {
    effect    = "Allow"
    actions   = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      "arn:aws:s3:::build.aburke.me",
      "arn:aws:s3:::build.aburke.me/*"
    ]
  }

  // Award calculator app bucket
  statement {
    effect    = "Allow"
    actions   = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      "arn:aws:s3:::award-calculator.ellie.aburke.me",
      "arn:aws:s3:::award-calculator.ellie.aburke.me/*"
    ]
  }
}

resource "aws_iam_user_policy" "ci_user" {
  name   = "award-calculator-ci-policy"
  user   = aws_iam_user.ci_user.name
  policy = data.aws_iam_policy_document.ci_policy.json
}
