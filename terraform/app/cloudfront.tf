resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.app_artifacts.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_path = "/app/${local.app_version}/web"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_distribution_oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = []
  # aliases = [local.public_domain_name]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    cache_policy_id = local.cloudfront_cache_policy_id

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 900
    max_ttl                = 7200
    compress = true
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      locations = ["AU"]
      restriction_type = "whitelist"
    }
  }

  tags = merge({
    Name = "Award calculator FE public distribution"
  }, local.default_tags)
}

resource "aws_cloudfront_origin_access_control" "s3_distribution_oac" {
  name                              = "s3_distribution"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
