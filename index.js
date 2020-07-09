class ServerlessGetHostedZone {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};

    this.variableResolvers = {
      hostedZoneId: this.getHostedZoneId,
    };

    // bindings
    this.log = this.log.bind(this)
  }

  log(msg) {
    this.serverless.cli.log(msg)
  }

  get awsCredentials() {
    return {
      ...this.serverless.providers.aws.getCredentials(),
      region: this.awsRegion,
    }
  }

  get awsRegion() {
    return this.serverless.providers.aws.getRegion();
  }

  get route53() {
    if (!this._route53) {
      this._route53 = new this.serverless.providers.aws.sdk.route53({
        ...this.awsCredentials,
        apiVersion: '2013-04-01',
      });
    }

    return this._route53;
  }

  async getHostedZoneId(src) {
    const DNSName = src.slice(13);

    const {
      HostedZones: [{
        HostedZoneId: hostedZoneId,
      } = {}]
    } = await this.route53.listHostedZonesByName({
      DNSName,
    }).promise();

    if (hostedZoneId == null) {
      throw new Error('Hosted Zone with that name not found.')
    }

    return hostedZoneId;
  }
}

module.exports = ServerlessGetHostedZone;