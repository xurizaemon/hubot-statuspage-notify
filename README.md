# Hubot StatusPage Notify

This Hubot plugin notifies on StatusPage events.

## What does this plugin do?

This plugin allows Hubot to report outages from StatusPage to your selected channels. It reports both the service status and incidents.

Here's what an incident might look like in channel (your team's excellent response discussion not shown).

```
Example Org status is All Systems Operational at 2020-11-08T15:46:43.360+13:00

Example Org status is Partial System Outage at 2020-11-08T15:49:59.435+13:00
Example Org critical incident: Neutrino burst damaged solar sails
- API (major_outage)
- https://stspg.io/dvkyc8p40rtv
We are currently investigating this issue.

Example Org status is Minor Service Outage at 2020-11-08T15:50:36.021+13:00
Example Org critical incident: Neutrino burst damaged solar sails
- API (partial_outage)
- https://stspg.io/dvkyc8p40rtv
The issue has been identified and a fix is being implemented.

Example Org status is All Systems Operational at 2020-11-08T15:51:01.928+13:00
Example Org critical incident: Neutrino burst damaged solar sails
- API (operational)
- https://stspg.io/dvkyc8p40rtv
A fix has been implemented and we are monitoring the results.

Example Org status is All Systems Operational at 2020-11-08T15:51:27.283+13:00
```

## Configuration

To monitor https://example-org.statuspage.io and https://example-net.statuspage.io and report outages to channel `#outages`:

```
HUBOT_STATUSPAGE_NOTIFY_PAGES="example-org example-net"
HUBOT_STATUSPAGE_NOTIFY_CHANNELS="#outages"
```

## Controlling StatusPage from Hubot

To control StatusPage from Hubot, use [hubot-statuspage]().