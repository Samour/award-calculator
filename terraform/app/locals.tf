locals {
  default_tags = {
    Environment = "Prod"
    Project = "award-calculator"
  }
  
  s3_origin_id = "AwardCalculatorOriginId"
  public_domain_name = "award-calculator.ellie.aburke.me"
  cloudfront_cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized policy
}
