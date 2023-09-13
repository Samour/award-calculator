#!/bin/bash

VERSION=$(TZ=UTC date +%Y-%m-%dT%H_%M_%S)
echo "app_version=$VERSION" >> "$GITHUB_OUTPUT"
