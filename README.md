# MCSKIN

A simple API to generate avatars with custom Minecraft Skins made with NodeJS.
(No database needed)

## HOW TO USE

After deploy the project usin NPM (see the package.json configuration), you need to register your own skin with a custom player name and UUID.

```bash
curl -X POST \
  $HOST/players \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -F uuid=537dba31-3abe-4558-bdd4-9f1454b064f3 \
  -F username=fake_player_name \
  -F skin=@path/to/skin.png
```

To get the avatar, you need to request the following URL:

```
$HOST/avatars/$UUID.png
```

Also, you are able to set the flag `overlay` into the avatar

```
$HOST/avatars/$UUID.png?overlay
```

If the UUID is not register into your instance, the API will redirect you to a [Crafatar](https://crafatar.com/) avatar in order to find a real user or a placeholder (such as Steve or Alex).

