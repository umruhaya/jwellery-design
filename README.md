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
