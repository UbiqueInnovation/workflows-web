# vpn-connect

Github action for connecting to OpenVPN server.
Based on [
github-openvpn-connect-action](https://github.com/kota65535/github-openvpn-connect-action).

## Inputs

### General Inputs

| Name          | Description                            | Required |
| ------------- | -------------------------------------- | -------- |
| `config_file` | Location of OpenVPN client config file | yes      |

### Authentication Inputs

| Name                    | Description                                                                                                        | Required when |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| `client_key`            | Local peer's private key                                                                                           | yes           |
| `tls_auth_key`          | Pre-shared secret for TLS-auth HMAC signature                                                                      | yes           |
| `certificate`           | Local peer's signed certificate -- must be signed by a certificate authority specified in 'certificate_authority'. | yes           |
| `certificate_authority` | Certificate authority (CA), also referred toas the root certificate.                                               | yes           |

**Note: It is strongly recommended that you provide all credentials
via [encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).**

## Usage

- Create client configuration file based on
  the [official sample](https://github.com/OpenVPN/openvpn/blob/master/sample/sample-config-files/client.conf).
- Usage in your workflow is like following:

```yaml
- name: Checkout
  uses: actions/checkout@v2
- name: Install OpenVPN
  run: |
    sudo apt update
    sudo apt install -y openvpn openvpn-systemd-resolved
- name: Connect to VPN
  uses: UbiqueInnovation/workflows-web/.github/actions/vpn-connect
  with:
    config_file: ./github/workflows/client.ovpn
    client_key: ${{ secrets.OVPN_CLIENT_KEY }}
    tls_auth_key: ${{ secrets.OVPN_TLS_AUTH_KEY }}
    certificate_authority: ${{ secrets.OVPN_CA }}
    certificate: ${{ secrets.OVPN_CERT }}
# The openvpn process is automatically terminated in post-action phase
```

## Development

When editing the source javascript files, don't forget to 'build' them with `npm run build`. This uses Vercel's [ncc](https://github.com/vercel/ncc) tool to compile modules into a single file including their dependencies.
