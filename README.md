# @lamsal-de/release-snapshot

Run `pnpx @lamsal-de/release-snapshot` to quickly release a version with `${packageJson.version}-SNAPSHOT-YYYYMMDD-HHmmSS`.

## Passing args to `npm publish`

Just double-dash escape you arguments. Like so: 
```sh
npx @lamsal-de/release-snapshot -- --tag foo --access public
```
