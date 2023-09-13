Generate timestamp:

```sh
TZ=UTC date +%Y-%m-%dT%H_%M_%S
```

Upload web assets:

```sh
aws s3 cp --recursive build/ s3://award-calculator.ellie.aburke.me/app/<VERSION>/web
```
