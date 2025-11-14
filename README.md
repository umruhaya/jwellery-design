# Cyo Design

## Tech Stack

- node v24 as runtime
- pnpm as package manager
- sqlite for local db
- drizzle orm
- hetzner s3 for files

refer to [Infra](./infra/README) for more details regarding the server setup.

## Env Setup

```bash
npm i -g pnpm
```

## Server setup

```bash
pnpm dev
```

## Updating

- connect to server using ssh key.
- switch to `cyo` user.
- navigate to `cyodesign` directory.
- using `ecosystem.config.cjs`, start the process using pm2 start or restart command.
- run `pm2 ressurect` to revive the running process after a server reboot
