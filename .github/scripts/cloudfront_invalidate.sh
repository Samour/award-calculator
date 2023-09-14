#!/bin/bash

aws cloudfront create-invalidation --distribution-id E100WVOJQPSM8T --paths '/*'
