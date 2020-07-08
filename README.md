# serverless-get-hosted-zone

This is a simple plugin for [Serverless Framework](https://serverless.com/) to get a HostedZoneId from a Hosted Zone created outside the Cloudformation Stack for use.

## Install

```bash
$ npm install serverless-get-hosted-zone --save-dev
```

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-get-hosted-zone
```

## Usage

Just use it as a Serverless Variable:

```yaml
myVariable: ${hostedZoneId:example.com}
```