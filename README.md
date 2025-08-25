### Server Setup

Instead of directly running the uvicorn command, we would use `systemd` to manage the server process.

First Create a systemd config file

```bash
sudo vim /etc/systemd/system/cyodesign.service
```

```ini
[Unit]
Description=Mental Wellness Uvicorn Daemon
After=network.target

[Service]
User=umernaeem135acc
Group=umernaeem135acc
WorkingDirectory=/home/umernaeem135acc/cyodesign-app
ExecStart=/home/umernaeem135acc/.local/bin/uvicorn app:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

After creating this file, follow these steps to reload `systemd` and start the service:

```bash
# Reload systemd to recognize the new service file
sudo systemctl daemon-reload

# Start the uvicorn service
sudo systemctl start cyodesign.service

# Enable the service to start on boot
sudo systemctl enable cyodesign.service
```

### Server Restart For Update

Whenever you want to refresh the server, (lets say you just ran `git pull` and updated the source code) then run

```bash
sudo systemctl restart cyodesign.service
```

### View Server Logs

T see th logs of the server run

```bash
journalctl -u cyodesign.service
```

You are correct that PM2 sometimes has issues with `nvm`-installed Node.js and with respecting certain CLI flags, especially for brand-new Node.js features like `--env-file`. Using **systemd** instead can be straightforward and avoids PM2’s abstraction!

# How to Run Your Project as a systemd Service

Suppose your entry is at:

```
/home/umernaeem135acc/cyodesign/dist/server/entry.mjs
```

And you want to use:

```
/home/umernaeem135acc/.nvm/versions/node/v22.17.0/bin/node --env-file=.env
```

Here’s how you can quickly set this up:

---

### 1. Create a systemd Service File

Edit (as root or with `sudo`):

```sh
sudo nano /etc/systemd/system/cyodesign.service
```

Paste the following (replace `[username]` if necessary):

```ini
[Unit]
Description=Cyodesign Node.js App
After=network.target

[Service]
Type=simple
User=umernaeem135acc
WorkingDirectory=/home/umernaeem135acc/cyodesign
ExecStart=/home/umernaeem135acc/.nvm/versions/node/v22.17.0/bin/node --env-file=.env dist/server/entry.mjs
Restart=on-failure
Environment=NODE_ENV=production PORT=8000

# If your .env is required for all variables, you may skip Environment= lines above
# Optionally, set a memory limit, etc.
# MemoryLimit=512M

[Install]
WantedBy=multi-user.target
```

---

### 2. Permissions

Give the proper permissions to your user so systemd can read/write to logs, or specify a `StandardOutput` if needed.

---

### 3. Reload systemd and Enable Service

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now cyodesign
sudo systemctl status cyodesign
```

---

### 4. View Logs

```sh
journalctl -u cyodesign -f
```

---

### 5. Troubleshooting

- If the service doesn't start, check `systemctl status cyodesign` and the logs for errors.
- Make sure your `.env` is present in the **WorkingDirectory**.
- The home directory and the nvm node path need to be accessible by the user you specify (usually the same, e.g., `umernaeem135acc`).
- If you get “ExecStart= No such file” errors, add the full path to `.env`:
  ```
  ExecStart=/home/umernaeem135acc/.nvm/versions/node/v22.17.0/bin/node --env-file=/home/umernaeem135acc/cyodesign/.env dist/server/entry.mjs
  ```

---

**You can always stop PM2 with `pm2 stop all` to avoid port conflicts.**

---

## TL;DR: Minimal Service File

```ini
[Unit]
Description=Cyodesign Node.js App

[Service]
User=umernaeem135acc
WorkingDirectory=/home/umernaeem135acc/cyodesign
ExecStart=/home/umernaeem135acc/.nvm/versions/node/v22.17.0/bin/node --env-file=.env dist/server/entry.mjs
Restart=always
Environment=NODE_ENV=production PORT=8000

[Install]
WantedBy=multi-user.target
```

---

**This setup will almost exactly mimic what you wanted, and is simple and very robust.**

Let me know if you run into any systemd errors!
