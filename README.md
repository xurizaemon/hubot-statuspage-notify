# Hubot StatusPage Notify

This Hubot plugin notifies on StatusPage events.

## Configuration

To monitor https://example-org.statuspage.io and https://example-net.statuspage.io and report outages to channel `#outages`:

```
HUBOT_STATUSPAGE_NOTIFY_PAGES="example-org example-net"
HUBOT_STATUSPAGE_NOTIFY_CHANNELS="#outages"
```

## Controlling StatusPage from Hubot

To control StatusPage from Hubot, use [hubot-statuspage]().