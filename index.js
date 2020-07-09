class ServerlessGetHostedZone {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};

    // bindings
    this.log = this.log.bind(this)
    this.getHostedZoneId = this.getHostedZoneId.bind(this)

    this.variableResolvers = {
      hostedZoneId: this.getHostedZoneId,
    };
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
      this._route53 = new this.serverless.providers.aws.sdk.Route53({
        ...this.awsCredentials,
        apiVersion: '2013-04-01',
      });
    }

    return this._route53;
  }

  async getHostedZoneId(src) {
    const DNSName = src.slice(13);

    this.log(`Getting hosted zone by name: ${DNSName}`);

    const data = this.route53.listHostedZonesByName({
      DNSName,
    }).promise();

    console.log(data);

    {
      HostedZones: [{
        HostedZoneId: hostedZoneId,
      } = {}] = []
    } = data;

    if (hostedZoneId == null) {
      throw new Error('Hosted Zone with that name not found.')
    }

    return hostedZoneId;
  }
}

module.exports = ServerlessGetHostedZone;